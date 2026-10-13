// 「icon 管理」设置页的长说明折叠成「短摘要 + 圆圈问号浮层」的回归测试(0.19.2)。
//
// 锁五件事,每一件坏了都会让这一屏要么变回一堵小灰字墙、要么把说明藏没:
//   * 14 条长说明各有自己的短摘要 key,中英成对、非空、够短;
//     —— 中文按 Unicode 码点(即"字")计数 ≤ 30;英文按空白分词 ≤ 30 词。
//        英文不按字符数是因为它天然比中文长,按字符数会被迫把话说残。
//   * 明确的短句(resetHint / appBadgeFootnote)与实时状态行(「当前环境:…」
//     「通知权限:…」)必须留在页面上,不许被折叠;
//   * 摘要 key 与原文 key 一一对应:没有孤儿摘要、没有重复、没有漏;
//   * 折叠只改变呈现:原长文一个字都不许少,`**` 成对闭合,`{n}` 占位符中英一致;
//   * 浮层文本把成对 `**x**` 渲染成真加粗节点(标记符不上屏),未成对 `**` 原样保留,
//     摘要行保持纯文本;官方 MenuSurface 与自绘兜底两条路都不抛、都出加粗节点。
//
// 跑法:在仓库根目录 `node test/hint-disclosure.mjs`(只读源码与 locale 字面量,不引入 jsdom/react)。

import { readFileSync } from 'node:fs'
const src = readFileSync('client/client.js', 'utf8')

function slice(startMarker, endMarker, label) {
  const a = src.indexOf(startMarker)
  if (a < 0) throw new Error('找不到 ' + label)
  const b = src.indexOf(endMarker, a)
  if (b < 0) throw new Error('找不到 ' + label + ' 的结尾')
  return src.slice(a, b)
}
function extract(marker, endMarker) {
  const a = src.indexOf(marker)
  if (a < 0) throw new Error('找不到 ' + marker)
  if (endMarker !== undefined) {
    const b = src.indexOf(endMarker, a)
    if (b < 0) throw new Error('找不到 ' + marker + ' 的结尾')
    return src.slice(a, b)
  }
  const i = src.indexOf('{', a + marker.length - 1)
  let d = 0
  for (let j = i; j < src.length; j++) {
    if (src[j] === '{') d++
    else if (src[j] === '}') { d--; if (d === 0) return src.slice(a, j + 1) }
  }
  throw new Error('括号不配对 ' + marker)
}

let pass = 0
let fail = 0
const check = (name, ok, detail) => {
  ok ? pass++ : fail++
  console.log((ok ? '  ✓ ' : '  ✗ ') + name + (ok || detail === undefined ? '' : '  ← ' + detail))
}

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

// 这一屏要折叠的 14 条长说明(阈值≈45 字,依据侦察到的字数)。
const FOLDED = [
  'uploadHint',
  'logoHint',
  'pwaHint',
  'clearDelayHint',
  'unreadIncludeSubagentsHint',
  'workspaceDotHint',
  'revealHint',
  'appBadgeHint',
  'notificationPermissionHint',
  'badgeSizeHint',
  'badgeTestHint',
  'runningMarkHint',
  'runningIncludeSubagentsHint',
  'headerRingHint'
]
// 必须留在页面上(短句 + 实时状态行),它们的 summary 不许存在。
const STAYS = [
  'resetHint',
  'appBadgeFootnote',
  'appBadgeProbeInstalled',
  'appBadgeProbeTab',
  'appBadgeProbeUnsupported',
  'appBadgeProbeInsecure',
  'notificationPermissionGranted',
  'notificationPermissionDefault',
  'notificationPermissionDenied',
  'notificationPermissionUnsupported'
]

const codePoints = (s) => [...s].length
const words = (s) => s.trim().split(/\s+/).length
const marks = (s) => (s.match(/\*\*/g) || []).length
const placeholders = (s) => (s.match(/\{[^}]*\}/g) || []).sort().join(',')
const summaryKey = (key) => key + 'Summary'

console.log('— 14 条折叠项:各有摘要 key,中英成对、非空、够短 —')
for (const key of FOLDED) {
  const sk = summaryKey(key)
  for (const [name, d] of [['zh', zh], ['en', en]]) {
    check(`${name} 有原文 ${key}`, typeof d[key] === 'string' && d[key] !== '', JSON.stringify(d[key]))
    check(`${name} 有摘要 ${sk}`, typeof d[sk] === 'string' && d[sk] !== '', JSON.stringify(d[sk]))
    // 摘要必须真的比原文短——否则"折叠"只是把两句都摆上来
    if (typeof d[key] === 'string' && typeof d[sk] === 'string') {
      check(`${name} ${sk} 比原文短`, d[sk].length < d[key].length, `${d[sk].length} vs ${d[key].length}`)
    }
  }
  if (typeof zh[sk] === 'string') check(`zh ${sk} ≤ 30 字`, codePoints(zh[sk]) <= 30, `${codePoints(zh[sk])} 字: ${zh[sk]}`)
  if (typeof en[sk] === 'string') check(`en ${sk} ≤ 30 词`, words(en[sk]) <= 30, `${words(en[sk])} 词: ${en[sk]}`)
}
// 长文不许被摘要顶替:折叠搬走的原文必须还在(硬信息一条都不许删)
for (const key of FOLDED) {
  check('zh 原文仍是一条长说明 ' + key, codePoints(zh[key] || '') > 40, `${codePoints(zh[key] || '')} 字`)
  check('en 原文仍是一条长说明 ' + key, (en[key] || '').length > 80, `${(en[key] || '').length} 字符`)
}

console.log('— 短句与实时状态行:不许被折叠 —')
for (const key of STAYS) {
  check(`zh 仍有未折叠的 ${key}`, typeof zh[key] === 'string' && zh[key] !== '')
  check(`en 仍有未折叠的 ${key}`, typeof en[key] === 'string' && en[key] !== '')
  check(`没有为 ${key} 造摘要(它该留在页面上)`, zh[summaryKey(key)] === undefined && en[summaryKey(key)] === undefined)
}
check('实时状态行「当前环境:…」仍在页面上渲染', src.includes('t(appBadgeCapabilityKey(appBadgeProbe))'))
check('实时状态行「通知权限:…」仍在页面上渲染', src.includes('t(notificationPermissionKey(notificationProbe))'))
check('短句 resetHint / appBadgeFootnote 仍直接渲染', src.includes('t("resetHint")') && src.includes('t("appBadgeFootnote")'))

console.log('— 摘要 key 与原文 key 一一对应:无孤儿、无重复 —')
const zhSummaries = Object.keys(zh).filter((k) => k.endsWith('Summary')).sort()
const enSummaries = Object.keys(en).filter((k) => k.endsWith('Summary')).sort()
check('中英摘要 key 集合一致', JSON.stringify(zhSummaries) === JSON.stringify(enSummaries), JSON.stringify(zhSummaries))
check(
  '摘要 key 恰好对应这 14 条原文',
  JSON.stringify(zhSummaries) === JSON.stringify(FOLDED.map(summaryKey).sort()),
  JSON.stringify(zhSummaries)
)
for (const key of FOLDED) {
  // 原长文不再占页面:它曾经是 `style.hint` 那一行小灰字。
  // (t("uploadHint") 还做超限报错的文案,那不是渲染位,允许保留。)
  check(`原文 key ${key} 不再占页面`, !src.includes('style.hint }, t("' + key + '")'), '仍有 style.hint 直接渲染')
  check(`${key} 由 hintLine 调用`, src.includes('hintLine("' + key + '")'))
}

console.log('— 浮层文案:markdown 加粗成对、占位符中英一致、摘要保持纯文本 —')
for (const key of FOLDED) {
  for (const [name, d] of [['zh', zh], ['en', en]]) {
    check(`${name} ${key} 的 ** 成对闭合`, marks(d[key]) % 2 === 0, `${marks(d[key])} 个 **`)
    check(`${name} ${summaryKey(key)} 不含 ** 标记`, !d[summaryKey(key)].includes('**'), JSON.stringify(d[summaryKey(key)]))
  }
  check(`${key} 的 {n} 占位符中英一致`, placeholders(zh[key]) === placeholders(en[key]), `${placeholders(zh[key])} / ${placeholders(en[key])}`)
}
check('原文里确实存在成对的 **(否则加粗测试是空转)', FOLDED.some((k) => marks(zh[k]) > 0 && marks(en[k]) > 0))

console.log('— 顺带修正:子代理归属指向开关,不再说"只有子代理不计" —')
check('zh badgeTestHint 指向那个开关', /子代理引起的结束也算未读.*开关/.test(zh.badgeTestHint), zh.badgeTestHint)
check('en badgeTestHint 指向那个开关', /switch above/.test(en.badgeTestHint), en.badgeTestHint)
check('zh 去掉过时的"只有子代理不计"', !zh.badgeTestHint.includes('只有子代理不计'))
check('en 去掉过时的 "Only sub-agents never count."', !en.badgeTestHint.includes('Only sub-agents never count.'))
check('源码里的过时注释也改了', !src.includes('Only sub-agent sessions never count'))

// —— 桩 React:只用真实组件跑一遍,不引入 jsdom/react-dom ——
// createElement 返回可断言的树;useState/useEffect 是不改状态的桩,所以"打开态"的
// 断言直接打在纯函数 hintBubbleNode 上(开合状态机本身由源码结构锁)。
function disclosureSandbox(primitives) {
  const React = {
    useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
    useEffect: () => {},
    Fragment: Symbol('Fragment'),
    createElement: (type, elProps, ...children) => ({ type, props: elProps || {}, children })
  }
  const requireStub = (spec) => {
    if (primitives !== null && spec === '@deepseek-ai/dsh-client-ui-primitives') return primitives
    throw new Error('client-modules: require("' + spec + '") missed the module table')
  }
  const windowStub = { innerWidth: 1200, innerHeight: 800, addEventListener: () => {}, removeEventListener: () => {} }
  const region = slice('//#region hint disclosure', '\t\tfunction FaviconSection(props) {', 'hint disclosure 区')
  return new Function(
    'React', 'require', 'window', 'document',
    region + '\nreturn { HintDisclosure, HintDisclosureBubble, hintBubbleNode, hintTextNodes, officialHintSurface };'
  )(React, requireStub, windowStub, {})
}

/** 把 hintTextNodes / 气泡树里所有可见文字拼回来,用于"不丢字"断言。 */
const visible = (nodes) => nodes
  .map((node) => (typeof node === 'string' ? node : visible(node.children || [])))
  .join('')

// 官方 MenuSurface 的桩:只证明"容器换成了它",材质由它自己画。
// 真实形态是 `forwardRef` 对象(typeof === "object",带 $$typeof/render),不是普通函数;
// 用这个形态当"官方可用"路径,才能锁住那个曾把官方路变成死代码的判据。
const MENUSURFACE_STUB = { $$typeof: Symbol.for('react.forward_ref'), render: function MenuSurfaceStub() { return null } }
// 兼容形态:某个构建若把它导出成普通函数,同样算可用。
const MENUSURFACE_FN_STUB = function MenuSurfaceFnStub() { return null }
const LABEL = '查看完整说明'
const PLACE = { left: 100, top: 206, width: 320 }

console.log('— 加粗渲染:成对**转 strong,未成对原样保留 —')
const offline = disclosureSandbox(null)
const { hintTextNodes } = offline
{
  const nodes = hintTextNodes('a **b** c')
  check('a **b** c → 三个子节点', nodes.length === 3, JSON.stringify(nodes.map((n) => (typeof n === 'string' ? n : n.type))))
  check('a **b** c → 中间是 strong 节点', typeof nodes[1] === 'object' && nodes[1].type === 'strong', String(nodes[1] && nodes[1].type))
  check('a **b** c → strong 里是 b,没有 ** 标记', nodes[1].children[0] === 'b' && !JSON.stringify(nodes).includes('**'), JSON.stringify(nodes[1].children))
  check('a **b** c → 可见文字 = 去掉标记的原文', visible(nodes) === 'a b c', visible(nodes))
}
{
  const nodes = hintTextNodes('**双** 与 **多**')
  check('多个成对**全部转换(2 个 strong)', nodes.filter((n) => typeof n === 'object' && n.type === 'strong').length === 2, JSON.stringify(nodes.map((n) => (typeof n === 'string' ? n : n.type))))
  check('多个成对**可见文字不丢字、无标记', visible(nodes) === '双 与 多' && !visible(nodes).includes('**'), visible(nodes))
}
{
  const nodes = hintTextNodes('a ** b')
  check('未成对 a ** b → 原样一个字不丢', nodes.length === 1 && nodes[0] === 'a ** b', JSON.stringify(nodes))
}
{
  const nodes = hintTextNodes('a **b')
  check('未成对 a **b → 原样保留', nodes.length === 1 && nodes[0] === 'a **b', JSON.stringify(nodes))
}
{
  const nodes = hintTextNodes('**a** and **b')
  check('半成对 → 成对的转 strong,落单的**原样留尾', nodes.length === 2 && nodes[0].type === 'strong' && nodes[1] === ' and **b', JSON.stringify(nodes.map((n) => (typeof n === 'string' ? n : n.type))))
}
{
  const nodes = hintTextNodes('')
  check('空文本 → 一个空子节点,不抛', nodes.length === 1 && nodes[0] === '', JSON.stringify(nodes))
}

console.log('— 14 条浮层内容:去掉 ** 后与原文可见文字一致(不丢字) —')
for (const key of FOLDED) {
  for (const [name, d] of [['zh', zh], ['en', en]]) {
    const nodes = hintTextNodes(d[key])
    check(`${name} ${key} 浮层可见文字 = 原文去掉标记`, visible(nodes) === d[key].replace(/\*\*/g, ''), visible(nodes).slice(0, 60))
    check(`${name} ${key} 标记符不上屏`, !visible(nodes).includes('**'))
    if (marks(d[key]) > 0) {
      check(`${name} ${key} 有成对**→至少一个真加粗节点`, nodes.some((n) => typeof n === 'object' && n.type === 'strong'))
    }
  }
}

console.log('— 两条路都不白屏:官方 MenuSurface 拿不到 / 拿得到,各跑一遍 —')
// (a) require 抛错(包缺失):落到自绘气泡,不抛,仍出加粗
try {
  const api = disclosureSandbox(null)
  check('兜底路:官方包拿不到时 surface 为 null', api.officialHintSurface() === null)
  const tree = api.HintDisclosure({ summary: '摘要', text: 'a **b** c', label: LABEL })
  check('兜底路:摘要仍在页面上、按钮带可访问标签', tree.children[0].children[0] === '摘要' && tree.children[1].props.label === LABEL)
  const bubbleEl = tree.children[1]
  const rendered = bubbleEl.type(bubbleEl.props)
  check('兜底路:默认不弹浮层(闭着不渲染气泡)', rendered.children[1] === null, JSON.stringify(rendered.children[1]))
  check('兜底路:问号按钮可点开(绑了 onClick)', typeof rendered.children[0].props.onClick === 'function')
  check('兜底路:按钮 aria-label 仍在', rendered.children[0].props['aria-label'] === LABEL && rendered.children[0].props.title === LABEL)
  const open = api.hintBubbleNode(true, null, LABEL, PLACE, 'a **b** c')
  check('兜底路:气泡是自绘 div', open.type === 'div' && open.props['data-icon-custom-hint'] === '1')
  check('兜底路:自带材质(边框/背景/圆角)', typeof open.props.style.border === 'string' && typeof open.props.style.background === 'string' && typeof open.props.style.borderRadius === 'string')
  check('兜底路:定位来自 hintBubblePlacement', open.props.style.left === '100px' && open.props.style.top === '206px' && open.props.style.width === '320px')
  check('兜底路:内容带真加粗节点', open.children.length === 3 && open.children[1].type === 'strong', JSON.stringify(open.children.map((n) => (typeof n === 'string' ? n : n.type))))
} catch (error) {
  check('兜底路不抛错(require 拿不到官方包)', false, String((error && error.message) || error))
}

// (b) require 拿得到:容器换成官方 MenuSurface,材质交给它,位置仍是我们的
try {
  const api = disclosureSandbox({ MenuSurface: MENUSURFACE_STUB })
  check('官方件是 forwardRef 对象(typeof 为 object,不是函数)', typeof MENUSURFACE_STUB === 'object' && MENUSURFACE_STUB.$$typeof === Symbol.for('react.forward_ref'))
  check('官方路:解析到官方 MenuSurface(对象形态也算可用)', api.officialHintSurface() === MENUSURFACE_STUB)
  const tree = api.HintDisclosure({ summary: '摘要', text: '完整说明', label: LABEL })
  check('官方路:摘要在前、气泡组件在后', tree.children[0].children[0] === '摘要' && tree.children[1].type === api.HintDisclosureBubble)
  const bubbleEl = tree.children[1]
  check('官方路:气泡容器是官方 MenuSurface', bubbleEl.props.surface === MENUSURFACE_STUB)
  const rendered = bubbleEl.type(bubbleEl.props)
  check('官方路:不抛且按钮 aria-label 仍在', rendered.children[0].props['aria-label'] === LABEL)
  const open = api.hintBubbleNode(true, MENUSURFACE_STUB, LABEL, PLACE, 'a **b** c')
  check('官方路:气泡根节点就是官方组件(不是自绘 div)', open.type === MENUSURFACE_STUB && open.type !== 'div', String(open.type))
  check('官方路:内容带真加粗节点', open.children.length === 3 && open.children[1].type === 'strong', JSON.stringify(open.children.map((n) => (typeof n === 'string' ? n : n.type))))
  check('官方路:材质不越权(不传我们的背景/边框/阴影/圆角)', open.props.style.background === undefined && open.props.style.border === undefined && open.props.style.boxShadow === undefined && open.props.style.borderRadius === undefined, JSON.stringify(open.props.style))
  check('官方路:定位/宽度仍由我们给(placement)', open.props.style.left === '100px' && open.props.style.top === '206px' && open.props.style.width === '320px')
  check('官方路:compact 让官方给小圆角', open.props.compact === true)
  check('官方路:气泡带 data 标记,点里面不算点空白', open.props['data-icon-custom-hint'] === '1' && open.props.role === 'dialog' && open.props['aria-label'] === LABEL)
} catch (error) {
  check('官方路不抛错(MenuSurface 可用时)', false, String((error && error.message) || error))
}

// (c) 兼容形态:官方件是普通函数时,同样走官方路
try {
  const api = disclosureSandbox({ MenuSurface: MENUSURFACE_FN_STUB })
  check('函数形态也算可用:解析到该函数', api.officialHintSurface() === MENUSURFACE_FN_STUB)
  const open = api.hintBubbleNode(true, MENUSURFACE_FN_STUB, LABEL, PLACE, '完整说明')
  check('函数形态:气泡根节点就是官方组件', open.type === MENUSURFACE_FN_STUB, String(open.type))
  const tree = api.HintDisclosure({ summary: '摘要', text: '完整说明', label: LABEL })
  check('函数形态:设置页仍拿它当气泡容器', tree.children[1].props.surface === MENUSURFACE_FN_STUB)
} catch (error) {
  check('函数形态不抛错', false, String((error && error.message) || error))
}

// 两条路 × 14 条 × 中英:都不抛,且成对**都产出 strong
try {
  let threw = null
  let boldOk = true
  for (const [name, d] of [['zh', zh], ['en', en]]) {
    for (const key of FOLDED) {
      for (const [label, surface] of [['兜底', null], ['官方', MENUSURFACE_STUB]]) {
        const api = disclosureSandbox(surface === null ? null : { MenuSurface: surface })
        const open = api.hintBubbleNode(true, surface, LABEL, PLACE, d[key])
        const strongs = open.children.filter((n) => typeof n === 'object' && n.type === 'strong').length
        if (strongs !== marks(d[key]) / 2) { boldOk = false; threw = `${label}/${name}/${key}: ${strongs} strong vs ${marks(d[key]) / 2} 对` }
      }
    }
  }
  check('两条路 × 14 条 × 中英:都出齐成对数量的加粗节点', boldOk, threw === null ? undefined : threw)
} catch (error) {
  check('两条路 × 14 条 × 中英:一条都不抛', false, String((error && error.message) || error))
}

console.log('— 浮层实现:MenuSurface + 自管开合;明确不用 Tooltip(label 限 string) —')
const region = slice('//#region hint disclosure', '\t\tfunction FaviconSection(props) {', 'hint disclosure 区')
check('官方容器按导出名存在即采用(不要求 typeof==="function":官方是 forwardRef 对象)', /primitives\.MenuSurface/.test(region) && !/typeof\s+primitives\.MenuSurface\s*===\s*"function"/.test(region))
check('官方容器兼容 function 与 object 两种形态', /typeof candidate === "function" \|\| typeof candidate === "object"/.test(region))
check('官方容器是懒解析且带 try/catch', /function officialHintSurface\(\)/.test(region) && region.includes('try {') && region.includes('catch (error)'))
check('不再有 officialHintTooltip', !src.includes('officialHintTooltip') && !src.includes('primitives.Tooltip'))
check('注释写明为何不用 Tooltip(label 限 string,无法加粗)', /Tooltip/.test(region) && /label/.test(region) && /string/.test(region) && /加粗|bold/i.test(region))
check('注释指到 ADR 0012', region.includes('docs/adr/0012-hint-bubble-menusurface.md'))
check('自管开合:再点按钮关闭', region.includes('if (open)') && region.includes('setRect(null)'))
check('自管开合:点空白关闭(mousedown 捕获)', region.includes('mousedown') && region.includes('data-icon-custom-hint-button'))
check('自管开合:ESC 关闭', region.includes('Escape'))
check('两条路共用同一个开合状态机', /function HintDisclosureBubble\(props\)/.test(region) && region.includes('hintBubbleNode(open, props.surface'))
check('浮层宽度约 320 且只由 placement 决定', region.includes('const HINT_BUBBLE_WIDTH = 320;') && /hintBubblePlacement\(rect, window\.innerWidth, window\.innerHeight\)/.test(region))

console.log('— 兜底定位:纯函数,不碰 DOM 也能验 —')
const place = new Function(
  'HINT_BUBBLE_WIDTH', 'HINT_BUBBLE_MARGIN', 'HINT_BUBBLE_GAP',
  extract('function hintBubblePlacement(anchor, viewportWidth, viewportHeight) {') + '\nreturn hintBubblePlacement'
)(320, 8, 6)
check('贴着按钮下方', place({ left: 100, bottom: 200 }, 1200, 800).top === 206, JSON.stringify(place({ left: 100, bottom: 200 }, 1200, 800)))
check('左越界被夹住', place({ left: -50, bottom: 10 }, 1200, 800).left === 8, JSON.stringify(place({ left: -50, bottom: 10 }, 1200, 800)))
check('右越界被夹住', place({ left: 1190, bottom: 10 }, 1200, 800).left === 872, JSON.stringify(place({ left: 1190, bottom: 10 }, 1200, 800)))
check('窄视口也不溢出', place({ left: 10, bottom: 10 }, 200, 800).width <= 184, JSON.stringify(place({ left: 10, bottom: 10 }, 200, 800)))
check('没有锚点时回退到边距', JSON.stringify(place(null, 1200, 800)) === JSON.stringify({ left: 8, top: 14, width: 320 }), JSON.stringify(place(null, 1200, 800)))

console.log(`\n结果: ${pass} 通过 · ${fail} 失败`)
process.exit(fail > 0 ? 1 : 0)
