// 「红点点了也不消」的回归测试(0.10.2)。
// 跑法:在仓库根目录 `node test/unread-clear.mjs`(它从 client/client.js 里切真实代码,
// 只桩掉 React / localStorage / 定时器,所以测的是即将发布的代码本身)。
// 抽的是 client/client.js 里的真实代码(见各 slice 的注释),只桩掉 React/localStorage/定时器。
import { readFileSync } from 'node:fs'
const src = readFileSync('client/client.js', 'utf8')

function slice(startMarker, endMarker, label) {
  const a = src.indexOf(startMarker)
  if (a < 0) throw new Error('找不到 ' + label)
  const b = src.indexOf(endMarker, a)
  if (b < 0) throw new Error('找不到 ' + label + ' 的结尾')
  return src.slice(a, b)
}
function extract(marker) {
  const a = src.indexOf(marker)
  if (a < 0) throw new Error('找不到 ' + marker)
  const i = src.indexOf('{', a + marker.length - 1)
  let d = 0
  for (let j = i; j < src.length; j++) {
    if (src[j] === '{') d++
    else if (src[j] === '}') { d--; if (d === 0) return src.slice(a, j + 1) }
  }
  throw new Error('括号不配对 ' + marker)
}

// —— 1. 水位存储(宿主时钟域 + v1→v2 迁移)——
const seenRegion = slice('const SEEN_STORE_KEY =', 'function currentSessionIds(list) {', 'seen store')
function makeStore(initial) {
  const data = new Map(Object.entries(initial))
  const localStorage = {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, v) }
  }
  const api = new Function('window', seenRegion + '\nreturn { seenState, noteSeen, noteHostClock, hostNow, loadSeenState, saveSeenState, pruneSeenState, ensureSeenBaseline }')({ localStorage })
  return { api, data }
}

// —— 2. 会话判定 ——
const helperSrc = slice('function currentSessionIds(list) {', '\n\t\t/**\n\t\t * How many sessions', 'currentSessionIds/lastTurnEndAt/stayKeyFor')
const collectSrc = slice('function collectUnread(list, pending, config, seen) {', '\n\t\t//#endregion', 'collectUnread')
const helpers = new Function('LAST_TURN_END_KEY', helperSrc + '\n' + collectSrc + '\nreturn { currentSessionIds, lastTurnEndAt, stayKeyFor, collectUnread }')('lastTurnEnd')

// —— 3. BadgeSource 里那段真实的 effect(计时链 + 看门狗)——
const effectBody = slice('if (staySignature === "") return undefined;', '}, [staySignature, delayMs]);', 'stay effect')

const CONFIG = { reasons: { completed: true, error: true }, pending: true, workspaceDot: true, clearDelaySec: 5 }
const HOST_END = 1790773769922          // 真实数据:该会话最后一次结束(宿主时钟)
const REAL_WATERMARK = 1790773162000    // 真实数据:最后一次在它里面(比结束早 7.9 秒)

/** 确定性调度器:替掉 window.setTimeout,时间由测试推进。 */
function scheduler() {
  let now = 0, seq = 0
  const jobs = new Map()
  return {
    window: {
      setTimeout: (fn, ms) => { const id = ++seq; jobs.set(id, { at: now + Math.max(0, ms || 0), fn }); return id },
      clearTimeout: (id) => { jobs.delete(id) }
    },
    advance(ms) {
      const target = now + ms
      for (;;) {
        let next = null
        for (const [id, job] of jobs) if (job.at <= target && (next === null || job.at < next.job.at)) next = { id, job }
        if (next === null) break
        jobs.delete(next.id)
        now = next.job.at
        next.job.fn()
      }
      now = target
    }
  }
}

/**
 * 跑一次「进入会话并连续停留 stayMs」,返回结束时各会话是不是还红着。
 * @param browserBehindMs - 浏览器时钟比宿主慢多少(宿主 = 浏览器 + 这个值)
 * @param rows - 会话行;默认只有一个被 mainView 保留的会话 V
 * @param raceEndAt - 第一次计时到点后,把 V 的结束时间换成这个值(模拟"标记刚落下又来一次新结束")
 * @param delaySec - clearDelaySec
 */
function stay({ browserBehindMs = 0, stayMs = 30000, rows = null, raceEndAt = null, delaySec = 5 } = {}) {
  const config = { ...CONFIG, clearDelaySec: delaySec }
  const list = { ids: [], byId: {} }
  const mk = (id, endAt, mainView) => { list.byId[id] = { id, projectionValues: { lastTurnEnd: { endAt, reason: 'error' } }, retainedBy: mainView ? { mainView: 1 } : {} }; list.ids.push(id) }
  for (const r of rows === null ? [{ id: 'V', endAt: HOST_END, mainView: true }] : rows) mk(r.id, r.endAt, r.mainView)

  // 浏览器时钟 = 宿主时钟 - browserBehindMs;Date.now() 与宿主样本都出自这一个假时钟
  const hostBase = HOST_END + 600000
  const RealDate = Date
  globalThis.Date = class extends RealDate { static now() { return hostBase - browserBehindMs } }

  const seed = {}
  for (const r of rows === null ? [{ id: 'V' }] : rows) seed[r.id] = REAL_WATERMARK
  const { api } = makeStore({ 'dsh-icon-custom.unread-seen.v2': JSON.stringify({ domain: 'host', lastActiveAt: HOST_END - 86400000, seen: seed }) })
  api.noteHostClock(hostBase)               // 宿主给出自己的 now → 客户端学到偏移

  const sched = scheduler()
  const seenRef = api.seenState
  const runEffect = new Function('staySignature', 'delayMs', 'stayLive', 'seenState', 'noteSeen', 'saveSeenState', 'bumpStay', 'window', 'lastTurnEndAt', effectBody + '\nreturn undefined;')
  const signatureOf = () => helpers.currentSessionIds(list)
    .filter((id) => helpers.collectUnread(list, null, config, seenRef.seen).some((i) => i.id === id))
    .map((id) => helpers.stayKeyFor(id, list)).join('|')
  runEffect(signatureOf(), delaySec * 1000, { current: { list } }, seenRef, api.noteSeen, api.saveSeenState, () => {}, sched.window, helpers.lastTurnEndAt)

  sched.advance(delaySec * 1000 + 100)      // 走到第一次计时到点(以及它的看门狗重排)
  if (raceEndAt !== null) list.byId.V.projectionValues.lastTurnEnd.endAt = raceEndAt
  sched.advance(stayMs)
  globalThis.Date = RealDate
  return {
    seen: seenRef.seen,
    domain: seenRef.domain,
    hostNow: api.hostNow,
    red: (id) => helpers.collectUnread(list, null, config, seenRef.seen).some((i) => i.id === id)
  }
}

let pass = 0, fail = 0
const check = (n, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  ok ? pass++ : fail++
  console.log((ok ? '  ✓ ' : '  ✗ ') + n + (ok ? '' : `\n      期望=${JSON.stringify(want)}\n      实际=${JSON.stringify(got)}`))
}

console.log('— 时钟域:水位与 turn/end.time 必须在同一个时钟 —')
check('浏览器与宿主同钟 → 停留后红点消失', stay().red('V'), false)
check('浏览器比宿主慢 30 秒(修复前:永远不消) → 仍然消失', stay({ browserBehindMs: 30000 }).red('V'), false)
check('慢 30 秒 + clearDelaySec=0(修复前最容易被时钟打穿) → 也消失', stay({ browserBehindMs: 30000, delaySec: 0 }).red('V'), false)
check('宿主比浏览器慢 45 秒(反向偏差)→ 也消失', stay({ browserBehindMs: -45000 }).red('V'), false)

console.log('— 多个 mainView 会话:每个会话各算各的时钟 —')
{
  const r = stay({ rows: [{ id: 'OTHER', endAt: HOST_END - 60000, mainView: true }, { id: 'V', endAt: HOST_END, mainView: true }] })
  check('当前会话排在第二个(修复前:它永远清不掉) → 消失', r.red('V'), false)
  check('排第一的那个也一并记成已读', r.red('OTHER'), false)
}

console.log('— 看门狗:标记落下了但红点还在,不再一锤子买卖 —')
check('第一次标记后冒出新结束 → 2 秒后重试并清掉', stay({ raceEndAt: HOST_END + 8000 }).red('V'), false)

console.log('— 水位存储 —')
{
  const { api } = makeStore({})
  check('空库 → 默认 host 域', api.seenState.domain, 'host')
  const sampledAt = Date.now()
  api.noteHostClock(1790776000000)
  // ±2ms:两次 Date.now() 之间可能跨毫秒,断言不该依赖它
  check('学到宿主/浏览器偏移', Math.abs(api.hostNow() - Date.now() - (1790776000000 - sampledAt)) <= 2, true)
}
{
  const legacy = { lastActiveAt: 1790770000000, seen: { a: 1790770100000 } }
  const hostAt = Date.now() + 45000                  // 宿主比浏览器快 45 秒
  const { api } = makeStore({ 'dsh-icon-custom.unread-seen.v1': JSON.stringify(legacy) })
  check('读到 v1 先当浏览器域(等宿主样本)', api.seenState.domain, 'browser')
  api.noteHostClock(hostAt)
  check('v1 的每会话水位整体平移进宿主域', api.seenState.seen.a - legacy.seen.a, 45000)
  check('v1 的 lastActiveAt 同样平移', api.seenState.lastActiveAt - legacy.lastActiveAt, 45000)
  check('迁移后域标记为 host', api.seenState.domain, 'host')
}
{
  const { api } = makeStore({ 'dsh-icon-custom.unread-seen.v2': JSON.stringify({ domain: 'host', lastActiveAt: 0, seen: { a: 500 } }) })
  check('标记不倒退:记更小的值无效', api.noteSeen('a', 400), false)
  check('标记不倒退:值保持 500', api.seenState.seen.a, 500)
  check('标记前进:更大的值写入', api.noteSeen('a', 600), true)
  check('没有 turn end 的会话也能记(回落宿主 now)', api.noteSeen('b', 0), true)
}

console.log('— 行定位:按官方 data-row-key,不再靠标题文字 —')
{
  const seen = []
  const container = { querySelector: (sel) => { seen.push(sel); return null } }
  const fn = new Function(extract('function sessionRowElement(container, id) {') + '\nreturn sessionRowElement')()
  fn(container, 'session-abc')
  check('选择器用会话 id 拼 data-row-key', seen[0], '[data-row-key="session:session-abc"]')
  check('空 id 不查 DOM', fn(container, ''), null)
}

console.log('— 降级姿态:放弃时撤掉红点,而不是冻在那儿 —')
{
  const region = slice('let workspaceDotFailures = 0;', '\t\t/** The marker already sitting in this host', 'dots breaker')
  const api = new Function('document', 'WS_MAX_FAILURES', region + '\nreturn { noteWorkspaceDotFailure, workspaceDotRestores, state: () => ({ givenUp: workspaceDotGivenUp, restores: workspaceDotRestores.length }) }')({ querySelectorAll: () => [] }, 3)
  api.workspaceDotRestores.push({ el: { style: { position: '' } }, position: '' })
  api.noteWorkspaceDotFailure('第一次')
  api.noteWorkspaceDotFailure('第二次')
  check('两次失败还不放弃(红点照常显示)', api.state().givenUp, false)
  api.noteWorkspaceDotFailure('第三次')
  check('第三次连续失败 → 放弃', api.state().givenUp, true)
  check('放弃时把已有的点撤掉', api.state().restores, 0)
}

console.log(`\n结果: ${pass} 通过 · ${fail} 失败`)
process.exit(fail > 0 ? 1 : 0)
