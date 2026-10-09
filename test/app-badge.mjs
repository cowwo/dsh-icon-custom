// 应用图标角标(OS 图标上的角标)的回归测试(0.11.1)。
// 跑法:在仓库根目录 `node test/app-badge.mjs`(从 client/client.js 切真实代码,只桩 window/navigator)。
//
// 测的是"决定"那一半:该设几、该清空、自检该说哪句话、以及"同一件事不要重复调 API"。
// 真机能不能显示角标不在这里——那由系统决定(见 docs/adr/0005-app-icon-badge.md)。
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

// —— 真实代码:显示模式白名单 ——
const modesAt = src.indexOf('const APP_DISPLAY_MODES =')
if (modesAt < 0) throw new Error('找不到 APP_DISPLAY_MODES')
const modesSrc = src.slice(modesAt, src.indexOf(';', modesAt) + 1)

// —— 真实代码:适配器记住"上次设过什么"的那个变量 ——
const stateAt = src.indexOf('let lastAppBadgeId = null;')
if (stateAt < 0) throw new Error('找不到 lastAppBadgeId')
const stateSrc = src.slice(stateAt, stateAt + 'let lastAppBadgeId = null;'.length)

// —— 真实代码:角标那一段(纯函数 + 唯一适配器) ——
const code = [
  modesSrc,
  stateSrc,
  extract('function normalizeCount(value) {'),
  extract('function badgeCapabilityProbe(env) {'),
  extract('function appBadgeEnv() {'),
  extract('function appBadgeEffect(count, enabled) {'),
  extract('function appBadgeCapabilityKey(probe) {'),
  extract('function applyAppBadge(effect, force) {'),
  extract('function reconcileAppBadge(force) {'),
  extract('function reassertAppBadge() {')
].join('\n')

/**
 * 一个"浏览器"桩:window/navigator 可控,calls 记录真被调用的 API。
 * @param options - `{ secure, match, standalone, hasApi, throws, rejectSet, rejectClear }`
 */
function sandbox(options) {
  const o = options || {}
  const calls = { set: [], clear: 0 }
  const nav = {}
  if (o.hasApi !== false) {
    nav.setAppBadge = (value) => {
      calls.set.push(value)
      if (o.throws === true) throw new Error('boom')
      return o.rejectSet === true ? Promise.reject(new Error('reject set')) : Promise.resolve()
    }
    nav.clearAppBadge = () => {
      calls.clear++
      if (o.throws === true) throw new Error('boom')
      return o.rejectClear === true ? Promise.reject(new Error('reject clear')) : Promise.resolve()
    }
  }
  if (o.standalone === true) nav.standalone = true
  const win = {
    isSecureContext: o.secure !== false,
    matchMedia: (query) => ({ matches: Array.isArray(o.match) ? o.match.includes(query) : false })
  }
  const api = new Function('window', 'navigator', 'effectiveCount', 'unreadConfig', code + `
    return { badgeCapabilityProbe, appBadgeEnv, appBadgeEffect, appBadgeCapabilityKey, applyAppBadge, reconcileAppBadge, reassertAppBadge,
      last: () => lastAppBadgeId }`)
  return { api: api(win, nav, () => (o.count || 0), { appBadge: o.enabled !== false }), calls, win, nav }
}

let pass = 0, fail = 0
const check = (n, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  ok ? pass++ : fail++
  console.log((ok ? '  ✓ ' : '  ✗ ') + n + (ok ? '' : `\n      期望=${JSON.stringify(want)}\n      实际=${JSON.stringify(got)}`))
}

console.log('— 投影:未读数是几 → 该设几/该清空 —')
const effect = sandbox({}).api.appBadgeEffect
check('0 → 清空', effect(0, true), { kind: 'clear' })
check('3 → 设 3', effect(3, true), { kind: 'set', value: 3 })
check('手动输入的字符串 "7" → 设 7', effect('7', true), { kind: 'set', value: 7 })
check('小数 2.9 → 设 2(与页内红点同一个 normalizeCount)', effect(2.9, true), { kind: 'set', value: 2 })
check('负数 → 清空', effect(-3, true), { kind: 'clear' })
check('NaN → 清空', effect(NaN, true), { kind: 'clear' })
check('null → 清空', effect(null, true), { kind: 'clear' })
check('不截断:128 原样交给系统(Chrome 自己显示 99+)', effect(128, true), { kind: 'set', value: 128 })
check('开关关掉 → 清空(不是"放着不管")', effect(3, false), { kind: 'clear' })
check('缺省(undefined)→ 清空', effect(3, undefined), { kind: 'clear' })
check('脏值 "yes" → 清空', effect(3, 'yes'), { kind: 'clear' })

console.log('— 能力探测:只报本机事实 —')
const probe = sandbox({}).api.badgeCapabilityProbe
check('脏输入 → 全 false', probe(null), { secure: false, hasApi: false, installed: false })
check('非布尔不当真', probe({ secure: 'yes', hasApi: 1, installed: 'true' }), { secure: false, hasApi: false, installed: false })
check('原样归一化', probe({ secure: true, hasApi: true, installed: false }), { secure: true, hasApi: true, installed: false })

console.log('— 能力探测:从真实 window/navigator 读 —')
{
  const fullscreen = sandbox({ match: ['(display-mode: fullscreen)'] }).api.appBadgeEnv()
  check('平台 manifest 是 fullscreen:装了应用必须认成已安装(只看 standalone 会永远误报)', fullscreen, { secure: true, hasApi: true, installed: true })
  const standalone = sandbox({ match: ['(display-mode: standalone)'] }).api.appBadgeEnv()
  check('standalone 模式也认', standalone.installed, true)
  const ios = sandbox({ standalone: true }).api.appBadgeEnv()
  check('iOS 的 navigator.standalone 也认', ios.installed, true)
  const tab = sandbox({}).api.appBadgeEnv()
  check('普通标签页:不是已安装', tab, { secure: true, hasApi: true, installed: false })
  const insecure = sandbox({ secure: false }).api.appBadgeEnv()
  check('局域网 http:安全上下文为假', insecure.secure, false)
  const firefox = sandbox({ hasApi: false }).api.appBadgeEnv()
  check('没有 API 的浏览器:hasApi 为假', firefox.hasApi, false)
}
{
  // matchMedia 抛异常不许把整段带崩(某些嵌入浏览器会)
  const api = new Function('window', 'navigator', code + '\nreturn appBadgeEnv()')({
    isSecureContext: true,
    matchMedia: () => { throw new Error('nope') }
  }, { setAppBadge: () => {}, clearAppBadge: () => {} })
  check('matchMedia 抛异常 → 当成未安装,不抛出去', api, { secure: true, hasApi: true, installed: false })
}

console.log('— 自检文案:四种本机情况,各说各的 —')
{
  const key = sandbox({}).api.appBadgeCapabilityKey
  check('非安全上下文优先(比"没 API"更该先解释)', key({ secure: false, hasApi: false, installed: false }), 'appBadgeProbeInsecure')
  check('安全上下文 + 没 API → 本机不支持', key({ secure: true, hasApi: false, installed: false }), 'appBadgeProbeUnsupported')
  check('有 API 但只是标签页 → 提示装成应用', key({ secure: true, hasApi: true, installed: false }), 'appBadgeProbeTab')
  check('已安装 + 有 API → 可以说"本机可以设置"', key({ secure: true, hasApi: true, installed: true }), 'appBadgeProbeInstalled')
  check('null → 退回"本机不支持"', key(null), 'appBadgeProbeUnsupported')
}

console.log('— 适配器:同一件事只调一次 API —')
{
  const s = sandbox({})
  s.api.applyAppBadge({ kind: 'set', value: 3 })
  s.api.applyAppBadge({ kind: 'set', value: 3 })
  check('连续两次 set 3 → 只调一次', s.calls.set, [3])
  check('记下了这次效果', s.api.last(), 'set:3')
  s.api.applyAppBadge({ kind: 'set', value: 4 })
  check('数变了 → 再调一次', s.calls.set, [3, 4])
  s.api.applyAppBadge({ kind: 'clear' })
  s.api.applyAppBadge({ kind: 'clear' })
  check('重复 clear → 只调一次', s.calls.clear, 1)
  check('clear 不会去调 set', s.calls.set, [3, 4])
}
{
  const s = sandbox({})
  s.api.applyAppBadge({ kind: 'set', value: 0 })
  check('脏效果(设 0)→ 当成清空,绝不把 0 交给系统', s.calls.set, [])
  s.api.applyAppBadge(null)
  check('null 效果 → 清空一次', s.calls.clear, 1)
}
{
  const s = sandbox({ throws: true })
  let threw = false
  try { s.api.applyAppBadge({ kind: 'set', value: 3 }) } catch { threw = true }
  check('API 抛异常不许冒泡(角标坏了不能影响页面)', threw, false)
  check('抛异常后不记假成功', s.api.last(), null)
  s.api.applyAppBadge({ kind: 'set', value: 3 })
  check('于是下次会重试', s.calls.set, [3, 3])
}
{
  const s = sandbox({ hasApi: false })
  s.api.applyAppBadge({ kind: 'set', value: 3 })
  s.api.applyAppBadge({ kind: 'clear' })
  check('没有 API 的浏览器:不调用、不报错', [s.calls.set, s.calls.clear], [[], 0])
  check('也不记状态(留着以后真能设时用)', s.api.last(), null)
}
console.log('— 适配器:Promise reject 不能记成成功 —')
{
  const s = sandbox({ rejectSet: true })
  s.api.applyAppBadge({ kind: 'set', value: 3 })
  await Promise.resolve()
  await Promise.resolve()
  check('set 被 reject 后不记假成功', s.api.last(), null)
  s.api.applyAppBadge({ kind: 'set', value: 3 })
  check('于是相同的 set 会再试一次', s.calls.set, [3, 3])
}
{
  const s = sandbox({ rejectClear: true })
  s.api.applyAppBadge({ kind: 'clear' })
  await Promise.resolve()
  await Promise.resolve()
  check('clear 被 reject 后不记假成功', s.api.last(), null)
  s.api.applyAppBadge({ kind: 'clear' })
  check('于是相同的 clear 会再试一次', s.calls.clear, 2)
}
console.log('— 看门狗:只重设正向数字,不清 0 —')
{
  const s = sandbox({ count: 3, enabled: true })
  s.api.reconcileAppBadge()
  check('先设 3', s.calls.set, [3])
  s.api.reconcileAppBadge()
  check('普通对账去重,不再调', s.calls.set, [3])
  s.api.reconcileAppBadge(true)
  check('强制对账会重发 3', s.calls.set, [3, 3])
  s.api.reassertAppBadge()
  check('角标看门狗也会重发 3', s.calls.set, [3, 3, 3])
}
{
  const s = sandbox({ count: 0, enabled: true })
  s.api.reassertAppBadge()
  check('未读为 0 时看门狗不反复清角标', [s.calls.set, s.calls.clear], [[], 0])
}
{
  const s = sandbox({ count: 5, enabled: false })
  s.api.reassertAppBadge()
  check('开关关掉时看门狗不重设', [s.calls.set, s.calls.clear], [[], 0])
}

console.log('— 接线:notifyBadge/emitUnreadConfig → 角标 —')
{
  const s = sandbox({ count: 3, enabled: true })
  s.api.reconcileAppBadge()
  check('真实未读 3 → 设 3', s.calls.set, [3])
  s.api.reconcileAppBadge()
  check('再对账一次 → 不重复调(notifyBadge 会被看门狗反复触发)', s.calls.set, [3])
}
{
  const s = sandbox({ count: 0, enabled: true })
  s.api.reconcileAppBadge()
  check('没有未读 → 清空', [s.calls.set, s.calls.clear], [[], 1])
}
{
  const s = sandbox({ count: 5, enabled: false })
  s.api.reconcileAppBadge()
  check('开关关掉 → 清空而不是留着 5', [s.calls.set, s.calls.clear], [[], 1])
}
{
  // 手动测试数字也走同一条路:effectiveCount() 已经算过来源,这里不重复判断
  const s = sandbox({ count: 42, enabled: true })
  s.api.reconcileAppBadge()
  check('手动测试 42 → 也推给系统(否则没法在真机上验证)', s.calls.set, [42])
}

console.log('— 客户端归一化:老宿主(响应里没有 appBadge)也必须能跑 —')
{
  const reasonsAt = src.indexOf('const UNREAD_FALLBACK_REASONS =')
  const badgeAt = src.indexOf('const UNREAD_APP_BADGE_FALLBACK =')
  const normalizeSrc = [
    src.slice(reasonsAt, src.indexOf(';', reasonsAt) + 1),
    src.slice(badgeAt, src.indexOf(';', badgeAt) + 1),
    extract('function normalizeClearDelay(input) {'),
    extract('function normalizeUnreadConfig(input) {')
  ].join('\n')
  const normalize = new Function(normalizeSrc + '\nreturn normalizeUnreadConfig')()
  check('空对象 → 默认开', normalize({}).appBadge, true)
  check('null(首屏还没拿到宿主响应)→ 默认开', normalize(null).appBadge, true)
  check('老宿主:响应里没有这个字段 → 默认开,不报错', normalize({ reasons: {}, pending: true, workspaceDot: true, clearDelaySec: 0 }).appBadge, true)
  check('用户关掉 → 保持关', normalize({ appBadge: false }).appBadge, false)
  check('脏值 "yes" → 回默认(而不是当成 true 之外的怪值)', normalize({ appBadge: 'yes' }).appBadge, true)
  check('其余字段不受影响', [normalize({ appBadge: false }).pending, normalize({ appBadge: false }).workspaceDot], [true, true])
}

console.log('— 字典:两种语言都有角标文案 —')
{
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
  for (const key of ['appBadgeLabel', 'appBadgeHint', 'appBadgeFootnote', 'appBadgeProbeInstalled', 'appBadgeProbeTab', 'appBadgeProbeUnsupported', 'appBadgeProbeInsecure']) {
    check('zh 有 ' + key, typeof zh[key], 'string')
    check('en 有 ' + key, typeof en[key], 'string')
  }
  // 自检文案不许承诺"一定显示"——那是系统说了算,而探测做不到
  for (const [name, d] of [['zh', zh], ['en', en]]) {
    check(name + ':已安装那句带"系统决定"的免责', /系统决定|up to the system/.test(d.appBadgeProbeInstalled), true)
    check(name + ':固定说明提到窗口开着才更新', /窗口开着|window is open/.test(d.appBadgeFootnote), true)
  }
}

console.log('— 标签页角标:合成失败也必须说出来(异步失败接不住同步 try/catch) —')
{
  // 真实代码:合成状态 + 告警去重 + 那个"绝不静默"的包装。
  const region = slice('let lastComposeError = null;', '\t\t/**\n\t\t * Re-assert the tab badge', 'favicon compose')
  const warnings = []
  const consoleStub = { warn: (...args) => warnings.push(args.map(String).join(' ')) }
  const api = new Function('Promise', 'console', region + '\nreturn { composeFavicon, setCompose: (fn) => { applyBadgeToFavicon = fn; } }')(Promise, consoleStub)
  const settle = () => new Promise((r) => setTimeout(r, 0))
  check('切片里拿到了包装函数', typeof api.composeFavicon, 'function')

  api.setCompose(() => Promise.resolve())
  api.composeFavicon(3, 'md')
  await settle()
  check('合成成功时不告警', warnings.length, 0)

  // 同步 try/catch 接不住异步 reject —— 这正是"没告警也没角标"的那种状态。
  api.setCompose(() => Promise.reject(new Error('icon-load')))
  api.composeFavicon(3, 'md')
  await settle()
  check('异步失败被说出来一次', warnings.length, 1)
  check('告警里带原因', /icon-load/.test(warnings[0] ?? ''), true)

  api.composeFavicon(3, 'md')
  await settle()
  check('同一原因不重复告警(5 秒看门狗会反复调)', warnings.length, 1)

  api.setCompose(() => Promise.reject(new Error('tainted')))
  api.composeFavicon(3, 'md')
  await settle()
  check('换了原因要再报一次', warnings.length, 2)

  api.setCompose(() => { throw new Error('sync-boom') })
  api.composeFavicon(3, 'md')
  await settle()
  check('同步抛错也被接住并报出', warnings.length, 3)
}

console.log(`\n结果: ${pass} 通过 · ${fail} 失败`)
process.exit(fail > 0 ? 1 : 0)
