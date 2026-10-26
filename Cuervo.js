const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')

async function iniciar() {
  const { state, saveCreds } = await useMultiFileAuthState('cuervo_auth')
  const sock = makeWASocket({ auth: state })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages[0]
    if (!msg.message || msg.key.fromMe) return
    const texto = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
    const jid = msg.key.remoteJid

    if (texto.toLowerCase() === "!rola") {
      await sock.sendMessage(jid, { text: "🐦‍⬛🔥 CUERVO te pone: Slayer - Raining Blood 🤘" })
    }
    if (texto.toLowerCase() === "!cuervo") {
      await sock.sendMessage(jid, { text: "Cuervo activo we 🐦‍⬛" })
    }
  })
}
iniciar()
