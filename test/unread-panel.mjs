// 「待处理」面板:结束时间/短号 + 一键全部标记已读(0.10.2)的回归测试。
// 跑法:在仓库根目录 `node test/unread-panel.mjs`(从 client/client.js 切真实代码,只桩依赖)。
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

// —— 真实代码:面板用到的纯函数 ——
const helpers = new Function(
  extract('function relativeAgeParts(at, now) {') + '\n' +
  extract('function unreadAgeLabel(at, now, t) {') + '\n' +
  extract('function shortSessionId(id) {') + '\n' +
  extract('function unreadRowSubtitle(item, now, t) {') + '\n' +
  extract('function unreadAckTargets(items) {') + '\n' +
  'return { relativeAgeParts, unreadAgeLabel, shortSessionId, unreadRowSubtitle, unreadAckTargets }'
)()

// —— 真实代码:组件里那段 markAllRead ——
const markSrc = extract('const markAllRead = () => {')

// —— 真实字典:只切对象字面量,不执行任何浏览器代码 ——
function dict(name, endMarker) {
  const body = slice('const ' + name + ' = {', endMarker, name + ' 字典')
  const literal = body
    .replace('const ' + name + ' = ', '')
    .replace(/;\s*$/, '')
    .replace(/\/\*\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '')
  return new Function('return (' + literal + ')')()
}
const zh = dict('zh', '\t\tconst en = {')
const en = dict('en', '\t\t//#endregion')

const MIN = 60000, HOUR = 3600000, DAY = 86400000
const NOW = 1790822784429

let pass = 0, fail = 0
const check = (n, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  ok ? pass++ : fail++
  console.log((ok ? '  ✓ ' : '  ✗ ') + n + (ok ? '' : `\n      期望=${JSON.stringify(want)}\n      实际=${JSON.stringify(got)}`))
}
/** 记录用到的 key,替代真的 t():验证"选了哪个 key"而不是文案本身。 */
const keyT = (key, params) => (params && typeof params.n === "number" ? key + ':' + params.n : key)

console.log('— 相对时间:必须和官方侧栏同一分档 —')
check('59 秒 → 刚刚', helpers.relativeAgeParts(NOW - 59000, NOW), { unit: 'now', n: 0 })
check('60 秒 → 1 分钟', helpers.relativeAgeParts(NOW - MIN, NOW), { unit: 'minutes', n: 1 })
check('59 分 → 59 分钟', helpers.relativeAgeParts(NOW - 59 * MIN, NOW), { unit: 'minutes', n: 59 })
check('60 分 → 1 小时', helpers.relativeAgeParts(NOW - HOUR, NOW), { unit: 'hours', n: 1 })
check('13 小时(用户这次的场景)', helpers.relativeAgeParts(NOW - 13 * HOUR - 1000, NOW), { unit: 'hours', n: 13 })
check('24 小时 → 1 天', helpers.relativeAgeParts(NOW - DAY, NOW), { unit: 'days', n: 1 })
check('30 天 → 1 个月', helpers.relativeAgeParts(NOW - 30 * DAY, NOW), { unit: 'months', n: 1 })
check('365 天 → 1 年', helpers.relativeAgeParts(NOW - 365 * DAY, NOW), { unit: 'years', n: 1 })
check('未来时间不出现负数', helpers.relativeAgeParts(NOW + 5000, NOW), { unit: 'now', n: 0 })

console.log('— 文案 key 选择 —')
check('刚刚 → ageNow', helpers.unreadAgeLabel(NOW - 1000, NOW, keyT), 'ageNow')
check('13 小时 → ageHours:13', helpers.unreadAgeLabel(NOW - 13 * HOUR - 1000, NOW, keyT), 'ageHours:13')
check('没有结束时间 → 不显示', helpers.unreadAgeLabel(0, NOW, keyT), '')
check('脏值 → 不显示', helpers.unreadAgeLabel('x', NOW, keyT), '')

console.log('— 短号:同名会话靠它区分 —')
check('session- 前缀去掉,取前 8 位', helpers.shortSessionId('session-e5dd6444-20b9-49d6-b25f-fa8362455367'), 'e5dd6444')
check('没有前缀也取前 8 位', helpers.shortSessionId('abcdefghijkl'), 'abcdefgh')
check('空 → 空', helpers.shortSessionId(''), '')
check('非字符串 → 空', helpers.shortSessionId(null), '')

console.log('— 面板第二行 —')
check('刚结束:状态 · 时间 · 短号',
  helpers.unreadRowSubtitle({ id: 'session-e5dd6444-20b9-49d6-b25f-fa8362455367', waiting: false, at: NOW - 13 * HOUR - 1000 }, NOW, keyT),
  'unreadEnded · ageHours:13 · e5dd6444')
check('在等你:不显示时间(它的 at 是"现在",不是结束时刻)',
  helpers.unreadRowSubtitle({ id: 'session-8efea540-4c0d-4b83-9f83-17112f762868', waiting: true, at: NOW }, NOW, keyT),
  'unreadWaiting · 8efea540')

console.log('— 一键已读只碰"结束"类,不碰"在等你" —')
const endedA = { id: 'session-aaaa1111-0000', waiting: false, at: 111 }
const endedB = { id: 'session-bbbb2222-0000', waiting: false, at: 222 }
const waiting = { id: 'session-cccc3333-0000', waiting: true, at: NOW }
check('只挑结束类', helpers.unreadAckTargets([endedA, waiting, endedB]), [{ id: endedA.id, seenAt: 111 }, { id: endedB.id, seenAt: 222 }])
check('没有结束时间的不挑', helpers.unreadAckTargets([{ id: 'session-dddd', waiting: false, at: 0 }]), [])
check('空表 → 空', helpers.unreadAckTargets(null), [])

{
  const seen = []
  const closed = []
  const poked = []
  const items = [endedA, waiting, endedB]
  const ackTargets = helpers.unreadAckTargets(items)
  const run = new Function('ackTargets', 'items', 'noteSeen', 'saveSeenState', 'emitUnreadPoke', 'emitUnreadPanel', markSrc + '\nreturn markAllRead')
  const markAllRead = run(ackTargets, items, (id, at) => { seen.push([id, at]); return true }, () => seen.push(['saved']), () => poked.push(1), (open) => closed.push(open))
  markAllRead()
  check('结束类被确认(记的是它自己的 endAt)', seen, [[endedA.id, 111], [endedB.id, 222], ['saved']])
  check('推动了徽标刷新', poked.length, 1)
  check('还有"在等你"的行 → 面板不关', closed, [])
}
{
  const closed = []
  const items = [endedA]
  const ackTargets = helpers.unreadAckTargets(items)
  const run = new Function('ackTargets', 'items', 'noteSeen', 'saveSeenState', 'emitUnreadPoke', 'emitUnreadPanel', markSrc + '\nreturn markAllRead')
  run(ackTargets, items, () => true, () => {}, () => {}, (open) => closed.push(open))()
  check('全部都是结束类 → 关掉面板', closed, [false])
}
{
  const seen = []
  const items = [waiting]
  const ackTargets = helpers.unreadAckTargets(items)
  const run = new Function('ackTargets', 'items', 'noteSeen', 'saveSeenState', 'emitUnreadPoke', 'emitUnreadPanel', markSrc + '\nreturn markAllRead')
  run(ackTargets, items, () => { seen.push(1); return true }, () => {}, () => {}, () => {})()
  check('只有"在等你"时什么都不做(按钮也不会显示)', seen, [])
}

console.log('— 字典:两种语言都有新文案 —')
for (const key of ['unreadMarkAllRead', 'ageNow', 'ageMinutes', 'ageHours', 'ageDays', 'ageMonths', 'ageYears']) {
  check('zh 有 ' + key, typeof zh[key], 'string')
  check('en 有 ' + key, typeof en[key], 'string')
}
check('zh 占位符是 {n}', Object.keys(zh).filter((k) => k.startsWith('age') && k !== 'ageNow').every((k) => zh[k].includes('{n}')), true)
check('en 占位符是 {n}', Object.keys(en).filter((k) => k.startsWith('age') && k !== 'ageNow').every((k) => en[k].includes('{n}')), true)

console.log(`\n结果: ${pass} 通过 · ${fail} 失败`)
process.exit(fail > 0 ? 1 : 0)
