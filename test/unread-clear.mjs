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
// 切片要从 `documentVisible` 起:现在的判定先看"屏幕报表"(对话节点/官方绑定),再看保留计数。
const helperSrc = slice('function documentVisible() {', '\n\t\t/**\n\t\t * How many sessions', 'viewedSessions/lastTurnEndAt')
const collectSrc = slice('function collectUnread(list, pending, config, seen, lit) {', '\n\t\t//#endregion', 'collectUnread')
/**
 * 一个假的 document:`nodes` 就是页面上那几个"对话正文"。
 *   * `{ id }`          —— 它渲染着哪个会话(缺 id = 对话在,但谁都没选,也就是落地页)
 *   * `{ id, aside }`   —— 它在右侧栏里(收起时仍挂在 DOM 上,只是看不见)
 *   * `{ id, inert }`   —— 它在 inert 子树里(点了没反应的那种)
 * 不传 `nodes` 时退回老写法:`displayed` 给了就当作页面上只有它。
 */
function fakeDocument({ displayed, nodes, hidden } = {}) {
  const list = nodes !== undefined ? nodes : (displayed === undefined ? [] : [{ id: displayed }])
  return {
    visibilityState: hidden === true ? 'hidden' : 'visible',
    querySelectorAll: (selector) => (selector !== '[data-conversation-session]' ? [] : list.map((node) => ({
      getAttribute: () => (node.id === undefined ? null : node.id),
      closest: (probe) => ((node.aside === true && probe === '[data-sidebar-right-panel]') || (node.inert === true && probe === '[inert]') ? {} : null)
    }))),
    querySelector: (selector) => (selector !== '[data-conversation-session]' || list.length === 0 ? null : {
      getAttribute: () => (list[0].id === undefined ? null : list[0].id)
    })
  }
}
function makeHelpers(document) {
  return new Function('LAST_TURN_END_KEY', 'document', helperSrc + '\n' + collectSrc + '\nreturn { viewedSessions, lastTurnEndAt, collectUnread, documentVisible, displayedSessionId, conversationOnScreen }')('lastTurnEnd', document)
}
const helpers = makeHelpers(fakeDocument())

// —— 3. BadgeSource 里那段真实的 effect(上弦 + 单次到点)——
const effectBody = slice('const snapshot = stayLive.current.list !==', '}, [staySignature, delayMs, watching, stayKnown]);', 'stay effect')

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
  const run = new Function('staySignature', 'stayIds', 'delayMs', 'watching', 'stayKnown', 'stayLive', 'stayArmed', 'seenState', 'noteSeen', 'saveSeenState', 'bumpStay', 'window', 'lastTurnEndAt', effectBody + '\nreturn undefined;')
  let cleanup = null
  let lastSig = null
  let watching = true
  let lastWatching = true
  let lastKnown = true
  // 屏幕报表:DOM 说的(displayed)、官方绑定说的(official)、落地页(idle)。
  // 三个都不给 → 退回保留计数 / list.current(老行为)。
  const screen = {}

  /** 一次渲染:要么"被看着的会话集合"变了(离开/进入),要么暂停/恢复/是否知道变了,才重跑 effect。 */
  const render = () => {
    stayLive.current = { list }
    const viewed = helpers.viewedSessions(list, screen)
    const stayIds = viewed.ids.slice().sort()
    const sig = stayIds.join("|")
    if (sig === lastSig && watching === lastWatching && viewed.known === lastKnown) return
    lastSig = sig
    lastWatching = watching
    lastKnown = viewed.known
    if (typeof cleanup === "function") cleanup()   // 空集合/暂停时 effect 提前返回,没有 cleanup
    cleanup = run(sig, stayIds, delaySec * 1000, watching, viewed.known, stayLive, stayArmed, api.seenState, api.noteSeen, api.saveSeenState, () => {}, sched.window, helpers.lastTurnEndAt)
  }

  const sim = {
    render,
    advance: (ms) => sched.advance(ms),
    /** 新一轮结束(只改 projection,不碰"被看着的会话集合")。 */
    setEndAt(id, endAt) { list.byId[id].projectionValues.lastTurnEnd.endAt = endAt },
    /** 切走/切回来:把"保留"换成这一组。 */
    view(ids) {
      for (const id of ids) if (!list.byId[id]) mk(id, 0, true)
      for (const row of Object.values(list.byId)) row.retainedBy = ids.includes(row.id) ? { mainView: 1 } : {}
      list.ids = Object.keys(list.byId)
    },
    /** 屏幕报表换一份(不传的键就清掉,等于"这一帧页面没这么说")。 */
    dom(next = {}) {
      for (const key of Object.keys(screen)) delete screen[key]
      Object.assign(screen, next)
      render()
    },
    red: (id) => helpers.collectUnread(list, null, config, api.seenState.seen).some((i) => i.id === id),
    count: () => helpers.collectUnread(list, null, config, api.seenState.seen).length,
    mark: (id) => api.seenState.seen[id],
    /** 暂停/恢复:切标签页到后台、或切到「设置/插件」页。 */
    setWatching(value) {
      watching = value === true
      render()
    },
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

  // 你切到别的会话:屏幕上有明确的答案("现在是 B"),这才叫离开。
  // (沉默的一帧不算离开,见后面「页面说不出你在哪」那一节。)
  sim.view(['B'])
  sim.dom({ displayed: 'B' })
  sim.advance(1000)
  check('切走后仍然亮着(离开不会顺手读掉它)', sim.red('V'), true)

  sim.view(['V'])                   // 你再进来
  sim.dom({ displayed: 'V' })
  sim.advance(4900)
  check('切回来待 4.9 秒:还亮', sim.red('V'), true)
  sim.advance(200)
  check('切回来待满 5 秒:这一轮才算看过', sim.mark('V'), HOST_END + 60000)
  check('红点灭了', sim.red('V'), false)
})

console.log('— 暂停 ≠ 离开:切标签页/开面板只暂停,去别的会话才算离开 —')
scenario({ rows: [{ id: 'A', endAt: HOST_END }] }, (sim) => {
  sim.render()                         // 进入 A → 上弦(HOST_END)
  // 还没待满就切到后台:暂停期间一秒都不许算
  sim.setWatching(false)
  sim.advance(120000)
  check('后台期间不算停留(进入时那一轮还没被确认)', sim.mark('A'), REAL_WATERMARK)
  sim.setWatching(true)
  sim.advance(4900)
  check('切回来 4.9 秒:还亮', sim.red('A'), true)
  sim.advance(200)
  check('切回来待满 5 秒:进入时那一轮才消', sim.red('A'), false)
  sim.setEndAt('A', HOST_END + 60000)  // 你还在 A 里,它又跑完一轮
  sim.render()
  sim.advance(1000)
  check('新结束的那一轮亮着', sim.red('A'), true)

  // 切到别的浏览器标签页:只暂停
  sim.setWatching(false)
  sim.advance(120000)
  check('后台期间不确认任何东西', sim.red('A'), true)
  sim.setWatching(true)                // 切回来
  sim.advance(6000)
  check('切标签页再回来,红点仍然亮(不是"离开又进来")', sim.red('A'), true)
  check('水位没有被推到新那一轮', sim.mark('A'), HOST_END)

  // 切到「设置/插件」页:也只暂停
  sim.setWatching(false)
  sim.advance(1000)
  sim.setWatching(true)
  sim.advance(6000)
  check('切到设置页再回来,红点仍然亮', sim.red('A'), true)

  // 去别的会话:这才算离开
  sim.view(['B'])
  sim.render()
  sim.advance(1000)
  sim.view(['A'])
  sim.render()
  sim.advance(4900)
  check('去别的会话再回来待 4.9 秒:还亮', sim.red('A'), true)
  sim.advance(200)
  check('待满 5 秒:这一轮才算看过', sim.mark('A'), HOST_END + 60000)
  check('红点灭了', sim.red('A'), false)
})

console.log('— 停留不足就切走:不算看过 —')
scenario({ rows: [{ id: 'V', endAt: HOST_END }] }, (sim) => {
  sim.render()
  sim.advance(3000)
  sim.view(['B'])                   // 3 秒就切走(去了别的会话:有明确答案)
  sim.dom({ displayed: 'B' })
  sim.advance(60000)
  check('没待满 → 水位没动', sim.mark('V'), REAL_WATERMARK)
  check('切回来还在(要重新待满)', (sim.view(['V']), sim.dom({ displayed: 'V' }), sim.red('V')), true)
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
  // ±2ms:偏移是 `hostAt - Date.now()` 现算的,取 hostAt 与调用它之间可能跨毫秒
  // (上一条用例已经吃过这个亏,这里同样不许把断言钉在整数上)。
  const shifted = (value) => Math.abs(value - 45000) <= 2
  check('v1 的每会话水位整体平移进宿主域', shifted(api.seenState.seen.a - legacy.seen.a), true)
  check('v1 的 lastActiveAt 同样平移', shifted(api.seenState.lastActiveAt - legacy.lastActiveAt), true)
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

console.log('— 页面说不出你在哪:不算离开(本次报告的"红点自己消失")—')
{
  scenario({ rows: [{ id: 'V', endAt: HOST_END }], delaySec: 2 }, (sim) => {
    sim.dom({ displayed: 'V' })          // 你在 V 里
    sim.advance(2000)                    // 进入时那一轮被确认
    check('进入 2 秒后:V 的红点消了(这是对的)', sim.red('V'), false)
    sim.setEndAt('V', HOST_END + 60000)  // 你还在 V 里,它又跑完一轮
    sim.render()
    check('在场时新结束的一轮:红点亮', sim.red('V'), true)

    // 这一帧页面说不出你在哪:全局面板把对话卸载了、实时通道断了、DOM 一时没有……
    // 关键:保留计数也被释放了(旧写法在这里会读成"空集合" → 丢掉进入快照)。
    sim.view([])
    sim.dom({})
    sim.advance(60000)
    check('说不出你在哪的那几帧:一个字都不许确认', sim.mark('V'), HOST_END)

    sim.view(['V'])
    sim.dom({ displayed: 'V' })          // 页面又能说了,还是同一个会话
    sim.advance(60000)
    check('回来是同一个会话:红点仍然亮着(修复前:2 秒后自己灭)', sim.red('V'), true)
    check('水位没有被追认到新那一轮', sim.mark('V'), HOST_END)
  })
}

console.log('— 对话被卸载时,官方绑定仍然说得清你在哪个会话 —')
{
  scenario({ rows: [{ id: 'V', endAt: HOST_END }], delaySec: 2 }, (sim) => {
    sim.dom({ displayed: 'V' })
    sim.advance(2000)
    sim.setEndAt('V', HOST_END + 60000)
    sim.render()
    check('在场时新结束的一轮:红点亮', sim.red('V'), true)
    // 打开全局面板:对话整个被卸载(DOM 一个字都说不出),但官方绑定还是 V。
    sim.view([])                         // 保留也放了(最坏情况)
    sim.dom({ official: 'V' })           // ctx.uiSession.adapter.current 说:还是 V
    sim.advance(60000)
    check('面板盖着、DOM 说不出:官方绑定说了算,不许确认', sim.mark('V'), HOST_END)
    sim.dom({ displayed: 'V' })
    sim.advance(60000)
    check('关掉面板回到 V:红点仍然亮着', sim.red('V'), true)
  })
}

console.log('— 落地页(对话在,但谁都没选中)才算离开 —')
{
  scenario({ rows: [{ id: 'V', endAt: HOST_END }], delaySec: 2 }, (sim) => {
    sim.dom({ displayed: 'V' })
    sim.advance(2000)
    sim.setEndAt('V', HOST_END + 60000)
    sim.render()
    sim.view(['V'])
    sim.dom({ idle: true })              // 对话在,但显示的是落地页(没选中任何会话)
    sim.advance(1000)
    sim.dom({ displayed: 'V' })          // 再进来:这是"切走又进来"
    sim.advance(2000)
    check('落地页算离开:再进来待满 2 秒,新那一轮才算看过', sim.mark('V'), HOST_END + 60000)
    check('红点灭了', sim.red('V'), false)
  })
}

console.log('— 最新一轮的结束方式被关掉:已经亮着的红点不许跟着灭 —')
{
  const list = {
    ids: ['V'],
    byId: { V: { id: 'V', displayTitle: 'V', projectionValues: { lastTurnEnd: { endAt: HOST_END, reason: 'completed' } } } }
  }
  const seen = { V: REAL_WATERMARK }
  const rules = { ...CONFIG, reasons: { ...CONFIG.reasons, 'aborted:user': false } }
  const h = makeHelpers(fakeDocument())
  check('最新一轮是 completed(开着):红点亮', h.collectUnread(list, null, rules, seen).length, 1)
  // 你按了停止:最新一轮变成 aborted:user(关着)。它不该把你还没读的那次"结束"一并抹掉。
  const stopped = { ids: ['V'], byId: { V: { id: 'V', displayTitle: 'V', projectionValues: { lastTurnEnd: { endAt: HOST_END + 60000, reason: 'aborted:user' } } } } }
  check('没点亮过的时候:关掉的原因不点亮红点', h.collectUnread(stopped, null, rules, seen).length, 0)
  check('已经亮着的时候:关掉的原因不许把它熄掉', h.collectUnread(stopped, null, rules, seen, new Set(['V'])).length, 1)
  // 而"你看过了"照旧能熄掉它:水位推过这一轮的 endAt。
  check('看过了(水位推过去)才算熄', h.collectUnread(stopped, null, rules, { V: HOST_END + 60000 }, new Set(['V'])).length, 0)
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
  const at = (doc, view) => makeHelpers(doc).viewedSessions(list, view)
  const onList = (snapshot, view) => makeHelpers(fakeDocument()).viewedSessions(snapshot, view)
  // 暂停信号(面板/后台)不再改变"在哪个会话上"——改了就会丢快照,回来就变成"重新进入"。
  const base = at(fakeDocument(), {})
  check('切到全局面板不改变集合(面板只暂停,不是离开)', at(fakeDocument(), { panelActive: true, visible: true }), base)
  check('标签页切到后台不改变集合(后台只暂停,不是离开)', at(fakeDocument(), { panelActive: false, visible: false }), base)
  check('屏幕上是哪个就只算哪个(残留保留不牵连)', at(fakeDocument(), { displayed: 'session-b' }), { ids: ['session-b'], known: true })
  check('拿不到屏幕信号时退回保留计数(老行为不退化)', at(fakeDocument(), {}), { ids: ['session-a', 'session-b'], known: true })
  check('list.current 仍排在保留计数之前', onList({ ...list, current: 'session-b' }, {}), { ids: ['session-b'], known: true })
  check('屏幕上的会话优先于 list.current', onList({ ...list, current: 'session-b' }, { displayed: 'session-a' }), { ids: ['session-a'], known: true })
  check('官方绑定排在 list.current 与保留计数之前', onList({ ...list, current: 'session-a' }, { official: 'session-b' }), { ids: ['session-b'], known: true })

  // 关键的一条:页面说不出任何会话时,这是"不知道",不是"没有会话"。
  const nowhere = { ids: [], byId: {} }
  check('DOM 没有节点 + 没有官方绑定 + 没有保留 → 不知道(不许当成离开)',
    makeHelpers(fakeDocument()).viewedSessions(nowhere, {}), { ids: [], known: false })
  check('对话在、但谁都没选中(落地页)→ 这是知道:你不在任何会话里',
    makeHelpers(fakeDocument({ nodes: [{ id: undefined }] })).viewedSessions(list, { idle: true }), { ids: [], known: true })
  check('会话列表都拿不到 → 不知道', makeHelpers(fakeDocument()).viewedSessions(null, {}), { ids: [], known: false })

  // 两个探针本身:DOM 说得清就读出来,说不清就交回 undefined(交给别的答案)。
  check('DOM 写着哪个会话就读出哪个', makeHelpers(fakeDocument({ displayed: 'session-x' })).displayedSessionId(), 'session-x')
  check('DOM 没有这个标记时交回 undefined', makeHelpers(fakeDocument()).displayedSessionId(), undefined)
  check('标签页隐藏时可见性为假', makeHelpers(fakeDocument({ hidden: true })).documentVisible(), false)
  check('标签页可见时可见性为真', makeHelpers(fakeDocument()).documentVisible(), true)

  // 右侧栏那个"收起但仍挂在 DOM 里"的嵌入对话不是答案(它排在文档里更早也不行)。
  const asideOnly = makeHelpers(fakeDocument({ nodes: [{ id: 'child', aside: true }] }))
  check('右侧栏里的嵌入对话不算"你在看它"', asideOnly.conversationOnScreen(), { rendered: false, id: undefined })
  const inertOnly = makeHelpers(fakeDocument({ nodes: [{ id: 'child', inert: true }] }))
  check('inert 子树里的对话也不算', inertOnly.conversationOnScreen(), { rendered: false, id: undefined })
  const both = makeHelpers(fakeDocument({ nodes: [{ id: 'child', aside: true }, { id: 'session-a' }] }))
  check('主区域的对话照旧说得清(隐藏的那个抢不走)', both.conversationOnScreen(), { rendered: true, id: 'session-a' })
  const hiddenFirst = makeHelpers(fakeDocument({ nodes: [{ id: 'child', aside: true }, { id: undefined }] }))
  check('隐藏的那个被跳过后,剩下的是"对话在、没选中"', hiddenFirst.conversationOnScreen(), { rendered: true, id: undefined })
}

console.log(`\n结果: ${pass} 通过 · ${fail} 失败`)
process.exit(fail > 0 ? 1 : 0)
