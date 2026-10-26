const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const P = require('pino')

async function iniciar() {
  const { state, saveCreds } = await useMultiFileAuthState('cuervo_auth')
  
  const sock = makeWASocket({ 
    auth: state, 
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ["Cuervo-Bot", "Chrome", "1.0"] 
  })

  if (!sock.authState.creds.registered) {
    const numero = "526462106206"
    console.log(`Pidiendo código para ${numero}...`)
    setTimeout(async () => {
      try {
        let code = await sock.requestPairingCode(numero)
        code = code?.match(/.{1,4}/g)?.join("-") || code
        console.log(`

TU CÓDIGO ES: ${code}

Ve a WhatsApp > Dispositivos vinculados > Vincular con número
`)
      } catch (e) {
        console.log("Error al pedir código:", e.message)
      }
    }, 3000)
  }

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection } = update
    if (connection === 'open') {
      console.log('CUERVO CONECTADO 🐦‍⬛')
    }
    if (connection === 'close') {
      console.log('Conexión cerrada, reintentando...')
      iniciar()
    }
  })
}

iniciar()