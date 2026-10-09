// 「红点什么时候才消」的回归测试。
// 跑法:在仓库根目录 `node test/unread-clear.mjs`(它从 client/client.js 里切真实代码,
// 只桩掉 React / localStorage / 定时器,所以测的是即将发布的代码本身)。
//
// 本文件锁的是「规则 A」(0.11.1,docs/adr/0006-entry-bounded-stay-clock.md):
//   * 停留计时器由「**进入会话**」上弦,不由「又结束一轮」上弦;
//   * 上弦那一刻的快照是固定的 —— 你人已经在会话里时新结束的那一轮,不算数,
//     它会一直亮着,等你切走再进来才清。
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
const seenRegion = slice('const SEEN_STORE_KEY =', '\n\t\t/**\n\t\t * Whether this page is on screen at all.', 'seen store')
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
// 切片要从 `documentVisible` 起:现在的判定先看"屏幕报表"(面板/可见性/DOM),再看保留计数。
const helperSrc = slice('function documentVisible() {', '\n\t\t/**\n\t\t * How many sessions', 'currentSessionIds/lastTurnEndAt')
const collectSrc = slice('function collectUnread(list, pending, config, seen) {', '\n\t\t//#endregion', 'collectUnread')
/** 一个假的 document:`displayed` 给了会话 id 就当作对话区渲染着它。 */
function fakeDocument({ displayed, hidden } = {}) {
  return {
    visibilityState: hidden === true ? 'hidden' : 'visible',
    querySelector: (selector) => (displayed === undefined || selector !== '[data-conversation-session]'
      ? null
      : { getAttribute: () => displayed })
  }
}
function makeHelpers(document) {
  return new Function('LAST_TURN_END_KEY', 'document', helperSrc + '\n' + collectSrc + '\nreturn { currentSessionIds, lastTurnEndAt, collectUnread, documentVisible, displayedSessionId }')('lastTurnEnd', document)
}
const helpers = makeHelpers(fakeDocument())

// —— 3. BadgeSource 里那段真实的 effect(上弦 + 单次到点)——
const effectBody = slice('const snapshot = stayLive.current.list !==', '}, [staySignature, delayMs]);', 'stay effect')

const CONFIG = { reasons: { completed: true, error: true }, pending: true, workspaceDot: true, clearDelaySec: 5 }
const HOST_END = 1790773769922          // 真实数据:某会话最后一次结束(宿主时钟)
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
 * 一个"页面"的模拟器,照 React 的语义跑那段 effect:**deps 没变就不重跑**。
 * 这一点是规则 A 的成败点——你待在会话里时又结束一轮,签名不变,计时器不该被动过。
 * @param delaySec - clearDelaySec
 * @param rows - 初始会话行 `{ id, endAt, mainView }`
 * @param browserBehindMs - 浏览器时钟比宿主慢多少(宿主 = 浏览器 + 这个值)
 */
function makeSim({ delaySec = 5, rows = [], browserBehindMs = 0 } = {}) {
  const config = { ...CONFIG, clearDelaySec: delaySec }
  const list = { ids: [], byId: {} }
  const mk = (id, endAt, mainView) => {
    list.byId[id] = { id, projectionValues: { lastTurnEnd: { endAt, reason: 'error' } }, retainedBy: mainView ? { mainView: 1 } : {} }
    if (!list.ids.includes(id)) list.ids.push(id)
  }
  for (const r of rows) mk(r.id, r.endAt, r.mainView !== false)

  // 浏览器时钟 = 宿主时钟 - browserBehindMs;Date.now() 与宿主样本都出自这一个假时钟
  const hostBase = HOST_END + 600000
  const RealDate = Date
  globalThis.Date = class extends RealDate { static now() { return hostBase - browserBehindMs } }

  const seed = {}
  for (const r of rows) seed[r.id] = REAL_WATERMARK
  const { api } = makeStore({ 'dsh-icon-custom.unread-seen.v2': JSON.stringify({ domain: 'host', lastActiveAt: HOST_END - 86400000, seen: seed }) })
  api.noteHostClock(hostBase)               // 宿主给出自己的 now → 客户端学到偏移

  const sched = scheduler()
  const stayLive = { current: { list } }
  const stayArmed = { current: new Map() }
  const run = new Function('staySignature', 'stayIds', 'delayMs', 'stayLive', 'stayArmed', 'seenState', 'noteSeen', 'saveSeenState', 'bumpStay', 'window', 'lastTurnEndAt', effectBody + '\nreturn undefined;')
  let cleanup = null
  let lastSig = null

  /** 一次渲染:只有"被看着的会话集合"变了才会拆掉旧计时器、重新上弦。 */
  const render = () => {
    stayLive.current = { list }
    const stayIds = helpers.currentSessionIds(list).slice().sort()
    const sig = stayIds.join('|')
    if (sig === lastSig) return
    lastSig = sig
    if (typeof cleanup === "function") cleanup()   // 空集合时 effect 提前返回,没有 cleanup
    cleanup = run(sig, stayIds, delaySec * 1000, stayLive, stayArmed, api.seenState, api.noteSeen, api.saveSeenState, () => {}, sched.window, helpers.lastTurnEndAt)
  }

  const sim = {
    render,
    advance: (ms) => sched.advance(ms),
    /** 新一轮结束(只改 projection,不碰"被看着的会话集合")。 */
    setEndAt(id, endAt) { list.byId[id].projectionValues.lastTurnEnd.endAt = endAt },
    /** 切走/切回来:把"被看着的会话"换成这一组。 */
    view(ids) {
      for (const id of ids) if (!list.byId[id]) mk(id, 0, true)
      for (const row of Object.values(list.byId)) row.retainedBy = ids.includes(row.id) ? { mainView: 1 } : {}
      list.ids = Object.keys(list.byId)
    },
    red: (id) => helpers.collectUnread(list, null, config, api.seenState.seen).some((i) => i.id === id),
    count: () => helpers.collectUnread(list, null, config, api.seenState.seen).length,
    mark: (id) => api.seenState.seen[id],
    restore: () => { globalThis.Date = RealDate }
  }
  return sim
}

/** 跑一个场景,结束后一定还原时钟(后面的用例要用真的 Date.now)。 */
function scenario(options, fn) {
  const sim = makeSim(options)
  try { fn(sim) } finally { sim.restore() }
}

let pass = 0, fail = 0
const check = (n, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  ok ? pass++ : fail++
  console.log((ok ? '  ✓ ' : '  ✗ ') + n + (ok ? '' : `\n      期望=${JSON.stringify(want)}\n      实际=${JSON.stringify(got)}`))
}

console.log('— 进入时已经存在的结束:停留够秒数 → 消 —')
scenario({ rows: [{ id: 'V', endAt: HOST_END }] }, (sim) => {
  sim.render()
  check('刚进入:红点亮', sim.red('V'), true)
  sim.advance(4900)
  check('待 4.9 秒:还亮', sim.red('V'), true)
  sim.advance(200)
  check('待满 5 秒:消(记的是它自己的 endAt)', sim.mark('V'), HOST_END)
  check('红点灭了', sim.red('V'), false)
})

console.log('— 规则 A:待在会话里时新结束的一轮,不追认 —')
scenario({ rows: [{ id: 'V', endAt: HOST_END }] }, (sim) => {
  sim.render()                      // 进入会话 → 上弦(HOST_END)
  sim.advance(1000)
  sim.setEndAt('V', HOST_END + 60000)  // 你还坐在里面,它又跑完一轮
  sim.render()                      // 重渲染:deps(被看着的会话)没变 → 计时器不重跑
  sim.advance(60000)
  check('新结束的那一轮仍然亮着(修复前:5 秒后自动消)', sim.red('V'), true)
  check('水位停在进入时那一轮,没有被追认到新的', sim.mark('V'), HOST_END)

  sim.view([])                      // 你切走
  sim.render()
  sim.advance(1000)
  check('切走后仍然亮着(离开不会顺手读掉它)', sim.red('V'), true)

  sim.view(['V'])                   // 你再进来
  sim.render()
  sim.advance(4900)
  check('切回来待 4.9 秒:还亮', sim.red('V'), true)
  sim.advance(200)
  check('切回来待满 5 秒:这一轮才算看过', sim.mark('V'), HOST_END + 60000)
  check('红点灭了', sim.red('V'), false)
})

console.log('— 停留不足就切走:不算看过 —')
scenario({ rows: [{ id: 'V', endAt: HOST_END }] }, (sim) => {
  sim.render()
  sim.advance(3000)
  sim.view([])                      // 3 秒就切走
  sim.render()
  sim.advance(60000)
  check('没待满 → 水位没动', sim.mark('V'), REAL_WATERMARK)
  check('切回来还在(要重新待满)', (sim.view(['V']), sim.render(), sim.red('V')), true)
})

console.log('— 延迟设成 0:进入即已读,但停留期间的新结束仍要等你下次进入 —')
scenario({ delaySec: 0, rows: [{ id: 'V', endAt: HOST_END }] }, (sim) => {
  sim.render()
  check('进入时存在的那一轮:立即消', sim.red('V'), false)
  sim.setEndAt('V', HOST_END + 60000)
  sim.render()
  sim.advance(60000)
  check('停留期间新结束的那一轮:仍然亮着', sim.red('V'), true)
})

console.log('— 本次真实故障(session-3b40e835):回合在你在场时结束 —')
{
  const T1 = Date.parse('2026-10-01T05:29:50.529Z')   // 第 1 回合结束(已读)
  const T2 = Date.parse('2026-10-01T05:30:57.567Z')   // 第 2 回合结束,人还在会话里
  scenario({ rows: [{ id: 'V', endAt: T1 }] }, (sim) => {
    sim.render()
    sim.advance(5000)               // 第 1 回合按规则被读掉
    check('第 1 回合已读', sim.red('V'), false)
    sim.setEndAt('V', T2)           // 05:30:57 第 2 回合结束
    sim.render()
    sim.advance(180000)             // 你读了 3 分钟
    check('3 分钟后红点仍然亮着(修复前:05:31:02 就没了)', sim.red('V'), true)
  })
}

console.log('— 两个会话同时被看着:各上各的弦 —')
scenario({ rows: [{ id: 'OTHER', endAt: HOST_END - 60000 }, { id: 'V', endAt: HOST_END }] }, (sim) => {
  sim.render()
  sim.advance(5000)
  check('两个都消', [sim.red('V'), sim.red('OTHER')], [false, false])
})

console.log('— 中途挤进来一个会话(瞬时多一个"被看着的")不会刷新我的快照 —')
scenario({ rows: [{ id: 'V', endAt: HOST_END }] }, (sim) => {
  sim.render()                          // 进入 V → 快照 HOST_END
  sim.setEndAt('V', HOST_END + 60000)   // V 又结束一轮
  sim.view(['V', 'B'])                  // 打开另一个会话:面板先保留新的、再释放旧的
  sim.render()
  sim.view(['V'])
  sim.render()
  sim.advance(60000)
  check('V 的新结束仍然亮着(快照没被顺带刷新)', sim.red('V'), true)
})

console.log('— 时钟域:浏览器与宿主差多少都不影响"待满即读" —')
scenario({ rows: [{ id: 'V', endAt: HOST_END }], browserBehindMs: 30000 }, (sim) => {
  sim.render()
  sim.advance(5100)
  check('浏览器比宿主慢 30 秒 → 照样消', sim.red('V'), false)
})
scenario({ rows: [{ id: 'V', endAt: HOST_END }], browserBehindMs: -45000 }, (sim) => {
  sim.render()
  sim.advance(5100)
  check('宿主比浏览器慢 45 秒 → 照样消', sim.red('V'), false)
})

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

console.log('— 屏幕报表:谁在被看着,由页面说了算 —')
{
  // 两个会话都挂着"主面板保留"——正是残留保留的样子。
  const list = {
    ids: ['session-a', 'session-b'],
    byId: {
      'session-a': { id: 'session-a', retainedBy: { mainView: 1 } },
      'session-b': { id: 'session-b', retainedBy: { mainView: 1 } }
    }
  }
  check('全局面板盖住对话时不看任何会话(修的就是这条)',
    makeHelpers(fakeDocument()).currentSessionIds(list, { panelActive: true, visible: true, displayed: undefined }), [])
  check('标签页隐藏时不看任何会话',
    makeHelpers(fakeDocument({ hidden: true })).currentSessionIds(list, { panelActive: false, visible: false, displayed: 'session-a' }), [])
  check('屏幕上是哪个就只算哪个(残留保留不牵连)',
    makeHelpers(fakeDocument()).currentSessionIds(list, { panelActive: false, visible: true, displayed: 'session-b' }), ['session-b'])
  check('拿不到屏幕信号时退回保留计数(老行为不退化)',
    makeHelpers(fakeDocument()).currentSessionIds(list, {}), ['session-a', 'session-b'])
  check('完全不传屏幕报表也退回保留计数',
    makeHelpers(fakeDocument()).currentSessionIds(list), ['session-a', 'session-b'])
  check('list.current 仍排在保留计数之前',
    makeHelpers(fakeDocument()).currentSessionIds({ ...list, current: 'session-b' }, {}), ['session-b'])
  check('屏幕上的会话优先于 list.current',
    makeHelpers(fakeDocument()).currentSessionIds({ ...list, current: 'session-b' }, { panelActive: false, visible: true, displayed: 'session-a' }), ['session-a'])
  // 两个探针本身:DOM 说得清就读出来,说不清就交回 undefined(交给保留计数)。
  check('DOM 写着哪个会话就读出哪个', makeHelpers(fakeDocument({ displayed: 'session-x' })).displayedSessionId(), 'session-x')
  check('DOM 没有这个标记时交回 undefined', makeHelpers(fakeDocument()).displayedSessionId(), undefined)
  check('标签页隐藏时可见性为假', makeHelpers(fakeDocument({ hidden: true })).documentVisible(), false)
  check('标签页可见时可见性为真', makeHelpers(fakeDocument()).documentVisible(), true)
}

console.log(`\n结果: ${pass} 通过 · ${fail} 失败`)
process.exit(fail > 0 ? 1 : 0)
