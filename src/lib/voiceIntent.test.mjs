// Intent routing for the voice assistant (src/lib/voiceIntent.ts).
// Node 24 strips the types, so this imports the real module.
import { parseWake, resolveIntent } from './voiceIntent.ts'

let fail = 0
const ok = (m, v) => { if (!v) { console.log('FAIL', m); fail++ } }

ok('product wins over page word', resolveIntent('Tell me about indici solutions').to === '/solutions#indici')
ok('sector anchor', resolveIntent('open primary care').to === '/sectors#primary-care')
ok('capability half-title', resolveIntent('do you do analytics?').to === '/services#data')
ok('contact reply has email', /@/.test(resolveIntent("what's your email").reply))
ok('page nav', resolveIntent('go to partners').to === '/partners')
ok('home', resolveIntent('take me home').to === '/')
ok('help has no route', resolveIntent('help').to === undefined)
ok('greeting', resolveIntent('hello jarvis').to === undefined)
ok('fallback', resolveIntent('banana').reply.includes('help'))

ok('no wake word', parseWake('open sectors') === null)
ok('wake alone', parseWake('Hey Jarvis') === '')
ok('wake + command', parseWake('hey jarvis, open sectors') === 'open sectors')
ok('wake mid-sentence', parseWake('um okay Jarvis go home') === 'go home')

if (fail) process.exit(1)
console.log('voiceIntent: all passed')
