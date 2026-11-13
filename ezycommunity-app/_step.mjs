// Ad-hoc helper (deleted after use): runs a list of actions in one Appium session, then prints labelled nodes + screenshot.
// usage: node _step.mjs <outPng> '<json actions>'   actions: ["tapDesc:Chat","tapXY:100,200","back","sleep:2000","dump:name","swipe:x1,y1,x2,y2"]
import { remote } from 'webdriverio'
import { writeFileSync } from 'node:fs'
const PKG = 'com.ezycommunity.android'
const [out, actionsJson] = process.argv.slice(2)
const d = await remote({ hostname: '127.0.0.1', port: 4723, path: '/', logLevel: 'silent', capabilities: {
    platformName: 'Android', 'appium:automationName': 'UiAutomator2', 'appium:deviceName': 'R5CYA314MRH', 'appium:appPackage': PKG,
    'appium:appActivity': '.MainActivity', 'appium:noReset': true, 'appium:waitForIdleTimeout': 0, 'appium:skipServerInstallation': true,
    'appium:skipDeviceInitialization': true, 'appium:newCommandTimeout': 120, 'appium:autoGrantPermissions': true } })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const mask = (s) => s.replace(/[\w.+-]+@[\w.-]+\.\w+/g, '<email>')
async function dump(name) {
    const xml = await d.getPageSource()
    const rows = []
    for (const m of xml.matchAll(/<([\w.]+)([^>]*?)\/?>/g)) {
        const a = Object.fromEntries([...m[2].matchAll(/([\w-]+)="([^"]*)"/g)].map((x) => [x[1], x[2]]))
        const label = (a['content-desc'] || a.text || '').replace(/&#10;|\n/g, ' / ').replace(/[⁦-⁩]/g, '')
        if (label || a.clickable === 'true') rows.push(`${m[1].split('.').pop()}${a.clickable === 'true' ? '*' : ''} ${mask(label)} ${a.bounds}`)
    }
    console.log(`--- ${name} (${await d.getCurrentPackage()})\n${rows.join('\n')}`)
    writeFileSync(`${out}-${name}.png`, Buffer.from(await d.takeScreenshot(), 'base64'))
}
if ((await d.getCurrentPackage()) !== PKG) { await d.activateApp(PKG); await sleep(4000) }
for (const act of JSON.parse(actionsJson)) {
    const [cmd, arg = ''] = act.split(/:(.*)/s)
    if (cmd === 'tapDesc') { const i = arg.includes('#') ? Number(arg.split('#')[1]) : 0; const el = d.$(`android=new UiSelector().descriptionContains("${arg.split('#')[0]}").instance(${i})`); if (await el.isExisting()) { await el.click(); console.log(`tapped ${arg}`) } else console.log(`NOT FOUND ${arg}`); await sleep(1500) }
    else if (cmd === 'tapXY') { const [x, y] = arg.split(',').map(Number); await d.execute('mobile: clickGesture', { x, y }); await sleep(1500) }
    else if (cmd === 'longXY') { const [x, y, ms] = arg.split(',').map(Number); await d.execute('mobile: longClickGesture', { x, y, duration: ms || 1500 }); await sleep(800) }
    else if (cmd === 'back') { await d.back(); await sleep(1200) }
    else if (cmd === 'sleep') await sleep(Number(arg))
    else if (cmd === 'swipe') { const [x1, y1, x2, y2] = arg.split(',').map(Number); await d.execute('mobile: shell', { command: 'input', args: ['swipe', x1, y1, x2, y2, '800'] }); await sleep(1000) }
    else if (cmd === 'dump') await dump(arg)
    else if (cmd === 'relaunch') { await d.terminateApp(PKG); await d.activateApp(PKG); await sleep(5000) }
}
await d.deleteSession()
