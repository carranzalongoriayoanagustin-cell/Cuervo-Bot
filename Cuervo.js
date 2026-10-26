const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')

async function iniciar() {
  const { state, saveCreds } = await useMultiFileAuthState('cuervo_auth')
  const sock = makeWASocket({ auth: state, printQRInTerminal: false })

  sock.ev.on('creds.update', saveCreds)
  
  sock.ev.on('connection.update', (update) => {
    const { qr, connection } = update
    if (qr) {
      console.log('ESCANEA ESTE QR:')
      qrcode.generate(qr, { small: true })
    }
    if (connection === 'open') {
      console.log('CUERVO CONECTADO 🐦‍⬛')
    }
  })

  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages[0]
    if (!msg.message || msg.key.fromMe) return
    const texto = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").toLowerCase()
    const jid = msg.key.remoteJid
    if (texto === "!cuervo") {
      await sock.sendMessage(jid, { text: "Cuervo activo we 🐦‍⬛🔥" })
    }
    if (texto === "!rola") {
      await sock.sendMessage(jid, { text: "🐦‍⬛ Te pone: Slayer - Raining Blood 🤘" })
    }
  })
}
iniciar()
