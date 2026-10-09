// 通知权限(WebKit 角标的前置条件)的回归测试(0.17.0)。
// 跑法:在仓库根目录 `node test/notification-permission.mjs`(从 client/client.js 切真实代码,
// 只桩 window/navigator/Notification)。
//
// 测的是"决定"那一半:权限读数怎么归一化、自检该说哪句话、"允许通知"按钮该不该出现、
// 申请走哪一条路(现代 Promise / 老回调 / 抛错 / 没有 API)、以及权限在页面外变了一次之后
// 会不会被发现。真机上 Safari 到底画不画角标不在这里——那由系统决定(见 ADR 0009)。
import { readFileSync } from 'node:fs'
const src = readFileSync('client/client.js', 'utf8')

function slice(startMarker, endMarker, label) {
  const a = src.indexOf(startMarker)
  if (a < 0) throw new Error('找不到 ' + label)
  const b = src.indexOf(endMarker, a)
  if (b < 0) throw new Error('找不到 ' + label + ' 的结尾')
  return src.slice(a, b)
}

// —— 真实代码:整个通知权限段(纯函数 + 唯一申请入口 + 订阅) ——
const region = slice('const NOTIFICATION_PERMISSION_STATES =', '\t\t//#region favicon compositing', '通知权限段')

/**
 * 一个"浏览器"桩:Notification / window / navigator.permissions 可控,
 * calls.request 记录真被发起的权限申请次数。
 * @param options - `{ hasApi, permission, grantTo, promiseStyle, reject, throws, queryStatus }`
 */
function sandbox(options) {
  const o = options || {}
  const calls = { request: 0 }
  const notificationApi = {}
  if (o.hasApi !== false) {
    notificationApi.permission = o.permission === undefined ? 'default' : o.permission
    notificationApi.requestPermission = (callback) => {
      calls.request++
      if (o.throws === true) throw new Error('boom')
      const answer = o.grantTo === undefined ? 'granted' : o.grantTo
      // 老 Safari 只回调、不返回 Promise;新浏览器反过来。
      if (o.promiseStyle === false) {
        notificationApi.permission = answer
        if (typeof callback === 'function') callback(answer)
        return undefined
      }
      if (o.reject === true) return Promise.reject(new Error('no user gesture'))
      notificationApi.permission = answer
      return Promise.resolve(answer)
    }
  }
  const winListeners = {}
  const win = {
    addEventListener: (type, fn) => { (winListeners[type] = winListeners[type] || []).push(fn) },
    removeEventListener: (type, fn) => { winListeners[type] = (winListeners[type] || []).filter((f) => f !== fn) }
  }
  const nav = {}
  if (o.queryStatus !== undefined) {
    nav.permissions = { query: () => Promise.resolve(o.queryStatus) }
  }
  const api = new Function('window', 'navigator', 'Notification', region + `
    return { normalizeNotificationPermission, notificationPermissionProbe, notificationPermissionEnv,
      notificationPermissionKey, notificationPermissionRequestable, requestNotificationPermission,
      subscribeNotificationPermission }`)
    (win, nav, o.hasApi === false ? undefined : notificationApi)
  const dispatch = (type) => (winListeners[type] || []).slice().forEach((fn) => fn())
  return { api, calls, win, winListeners, notificationApi, dispatch }
}

let pass = 0, fail = 0
const check = (n, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  ok ? pass++ : fail++
  console.log((ok ? '  ✓ ' : '  ✗ ') + n + (ok ? '' : `\n      期望=${JSON.stringify(want)}\n      实际=${JSON.stringify(got)}`))
}
const settle = () => new Promise((r) => setTimeout(r, 0))

console.log('— 归一化:只认规范里的三个字符串 —')
{
  const { api } = sandbox({})
  check('granted 原样', api.normalizeNotificationPermission('granted'), 'granted')
  check('denied 原样', api.normalizeNotificationPermission('denied'), 'denied')
  check('default 原样', api.normalizeNotificationPermission('default'), 'default')
  check('undefined(没有 API)→ unsupported', api.normalizeNotificationPermission(undefined), 'unsupported')
  check('null → unsupported', api.normalizeNotificationPermission(null), 'unsupported')
  check('脏值 "yes" → unsupported(不当成已授予)', api.normalizeNotificationPermission('yes'), 'unsupported')
  check('数字 1 → unsupported', api.normalizeNotificationPermission(1), 'unsupported')
}

console.log('— 探测:只报本机两个事实 —')
{
  const { api } = sandbox({})
  check('脏输入 → unsupported + 不能申请', api.notificationPermissionProbe(null), { state: 'unsupported', canRequest: false })
  check('非布尔不当真', api.notificationPermissionProbe({ permission: 'granted', canRequest: 'yes' }), { state: 'granted', canRequest: false })
  check('原样归一化', api.notificationPermissionProbe({ permission: 'default', canRequest: true }), { state: 'default', canRequest: true })
}

console.log('— 探测:从真实 window 读 —')
{
  check('已授予', sandbox({ permission: 'granted' }).api.notificationPermissionEnv(), { state: 'granted', canRequest: true })
  check('还没问过', sandbox({ permission: 'default' }).api.notificationPermissionEnv(), { state: 'default', canRequest: true })
  check('已被拒绝', sandbox({ permission: 'denied' }).api.notificationPermissionEnv(), { state: 'denied', canRequest: true })
  check('本机没有 Notification API', sandbox({ hasApi: false }).api.notificationPermissionEnv(), { state: 'unsupported', canRequest: false })
}

console.log('— 文案:四种读数各一句,缺省不许当成"已授予" —')
{
  const { api } = sandbox({})
  check('granted 的句子', api.notificationPermissionKey({ state: 'granted', canRequest: true }), 'notificationPermissionGranted')
  check('denied 的句子', api.notificationPermissionKey({ state: 'denied', canRequest: true }), 'notificationPermissionDenied')
  check('default 的句子', api.notificationPermissionKey({ state: 'default', canRequest: true }), 'notificationPermissionDefault')
  check('unsupported 的句子', api.notificationPermissionKey({ state: 'unsupported', canRequest: false }), 'notificationPermissionUnsupported')
  check('脏探测 → 也算没有这个能力', api.notificationPermissionKey('granted'), 'notificationPermissionUnsupported')
}

console.log('— 按钮:只有"还没决定"才值得弹一次 —')
{
  const { api } = sandbox({})
  check('未授予 + 有申请入口 → 显示按钮', api.notificationPermissionRequestable({ state: 'default', canRequest: true }), true)
  check('已授予 → 没得可问', api.notificationPermissionRequestable({ state: 'granted', canRequest: true }), false)
  check('已被拒绝 → 浏览器不会再弹,不该给假按钮', api.notificationPermissionRequestable({ state: 'denied', canRequest: true }), false)
  check('没有 API → 没有按钮', api.notificationPermissionRequestable({ state: 'unsupported', canRequest: false }), false)
  check('没有申请入口 → 没有按钮', api.notificationPermissionRequestable({ state: 'default', canRequest: false }), false)
}

console.log('— 申请:交给浏览器的两种形态都要能收尾 —')
{
  const s = sandbox({ permission: 'default', grantTo: 'granted' })
  await s.api.requestNotificationPermission().then((next) => {
    check('Promise 形态:解析成已授予', next, { state: 'granted', canRequest: true })
  })
  check('只申请一次', s.calls.request, 1)
}
{
  const s = sandbox({ permission: 'default', grantTo: 'granted', promiseStyle: false })
  await s.api.requestNotificationPermission().then((next) => {
    check('老回调形态(不返回 Promise):也能收尾', next, { state: 'granted', canRequest: true })
  })
  check('老回调形态:只申请一次', s.calls.request, 1)
}
{
  const s = sandbox({ permission: 'denied', grantTo: 'denied' })
  await s.api.requestNotificationPermission().then((next) => {
    check('用户拒绝 → 如实报拒绝', next, { state: 'denied', canRequest: true })
  })
  check('用户拒绝:也算申请过一次', s.calls.request, 1)
}
{
  // 不是用户手势、或不是已安装应用时,WebKit/Chromium 会 reject —— 不能把页面卡住。
  const s = sandbox({ permission: 'default', reject: true })
  await s.api.requestNotificationPermission().then((next) => {
    check('reject → 回落成重读的现值', next, { state: 'default', canRequest: true })
  })
}
{
  const s = sandbox({ permission: 'default', throws: true })
  await s.api.requestNotificationPermission().then((next) => {
    check('同步抛错 → 也回落成现值', next, { state: 'default', canRequest: true })
  })
  check('同步抛错:申请确实被发起过一次', s.calls.request, 1)
}
{
  const s = sandbox({ hasApi: false })
  await s.api.requestNotificationPermission().then((next) => {
    check('没有 API → 不发申请,直接报 unsupported', next, { state: 'unsupported', canRequest: false })
  })
  check('没有 API:一次都不申请', s.calls.request, 0)
}

console.log('— 不许自动申请:申请只能由点击触发 —')
{
  // 构造过程本身不许碰 requestPermission(挂载即弹窗是最讨人厌的失败模式)。
  const s = sandbox({ permission: 'default' })
  s.api.notificationPermissionEnv()
  s.api.notificationPermissionKey({ state: 'default', canRequest: true })
  check('只读探测不申请', s.calls.request, 0)
  const callSites = region.split('api.requestPermission(').length - 1
  check('申请入口只有一处(唯一调用点)', callSites, 1)
  check('按钮真的挂在 onClick 上(而不是 effect 里)', /onClick: onRequestPermission/.test(src), true)
}

console.log('— 订阅:页面外改的权限也要被发现 —')
{
  const s = sandbox({ permission: 'default' })
  const seen = []
  const off = s.api.subscribeNotificationPermission((next) => seen.push(next.state))
  check('挂载时不重复播报(设置页刚渲染过这个值)', seen, [])
  s.dispatch('focus')
  check('没变就不播报', seen, [])
  s.notificationApi.permission = 'granted'
  s.dispatch('focus')
  check('页面外变成已授予 → 播报一次', seen, ['granted'])
  s.dispatch('visibilitychange')
  check('同一事实不重复播报', seen, ['granted'])
  s.notificationApi.permission = 'denied'
  s.dispatch('pageshow')
  check('又变了 → 再播报一次', seen, ['granted', 'denied'])
  off()
  s.notificationApi.permission = 'granted'
  s.dispatch('focus')
  check('取消订阅后不再播报(卸载不留监听)', seen, ['granted', 'denied'])
}
{
  // permissions.query 是精确通道;change 事件要接上,也要能摘掉。
  const changeListeners = []
  const status = {
    addEventListener: (type, fn) => { if (type === 'change') changeListeners.push(fn) },
    removeEventListener: (type, fn) => { const i = changeListeners.indexOf(fn); if (i >= 0) changeListeners.splice(i, 1) }
  }
  const s = sandbox({ permission: 'default', queryStatus: status })
  const seen = []
  const off = s.api.subscribeNotificationPermission((next) => seen.push(next.state))
  await settle()
  check('query 的 change 已接上', changeListeners.length, 1)
  s.notificationApi.permission = 'granted'
  changeListeners.slice().forEach((fn) => fn())
  check('change 事件也会播报', seen, ['granted'])
  off()
  check('取消订阅会摘掉 change 监听', changeListeners.length, 0)
}
{
  // WebKit 不一定实现这个 descriptor:query 抛错/被拒都不许冒泡到页面。
  let threw = false
  try {
    const s = sandbox({ permission: 'default' })
    s.api.subscribeNotificationPermission(() => {})
  } catch { threw = true }
  check('没有 permissions.query 也不报错', threw, false)
}

console.log('— 字典:两种语言都有通知权限那几句,且不许替系统许诺 —')
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
  for (const key of ['notificationPermissionLabel', 'notificationPermissionGranted', 'notificationPermissionDefault', 'notificationPermissionDenied', 'notificationPermissionUnsupported', 'notificationPermissionButton', 'notificationPermissionHint']) {
    check('zh 有 ' + key, typeof zh[key], 'string')
    check('en 有 ' + key, typeof en[key], 'string')
  }
  for (const [name, d] of [['zh', zh], ['en', en]]) {
    check(name + ':说明里点明是 Safari 的规则', /Safari/.test(d.notificationPermissionHint), true)
    check(name + ':说明里点明 Chrome / Edge 不需要它', /Chrome \/ Edge/.test(d.notificationPermissionHint), true)
    check(name + ':说清只申请权限、不发通知', /不发通知|不会给你发通知|does not send notifications/.test(d.notificationPermissionHint), true)
    check(name + ':角标说明指向了通知权限那一行', /通知权限|permission row/.test(d.appBadgeHint), true)
  }
}

console.log(`\n结果: ${pass} 通过 · ${fail} 失败`)
process.exit(fail > 0 ? 1 : 0)
