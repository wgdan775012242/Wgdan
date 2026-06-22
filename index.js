const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const http = require('http');

// 🟢 هذا الجزء يمنع Render من إغلاق البوت
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Bot is running');
}).listen(process.env.PORT || 8080);

const phoneNumber = "967737044480"; 

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(phoneNumber);
                console.log(`\n========================================`);
                console.log(`📱 كود الربط: ${code}`);
                console.log(`========================================\n`);
            } catch (error) {
                console.log("جاري الانتظار للاتصال بالخادم...");
            }
        }, 15000); // 15 ثانية تأخير لضمان استقرار الاتصال
    }

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'close') {
            setTimeout(startBot, 5000); 
        } else if (connection === 'open') {
            console.log('✅ تم الاتصال بنجاح!');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startBot();
