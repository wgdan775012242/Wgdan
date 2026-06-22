const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');

// ⚠️ ضع رقم هاتفك هنا مع مفتاح الدولة (بدون علامة + أو أصفار)
// مثال لليمن: 9677XXXXXXXX
const phoneNumber = "967737044480"; 

const randomDelay = () => {
    const min = 3000;
    const max = 7000;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
};

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // تم إيقاف الـ QR لأننا سنستخدم كود الربط
        logger: pino({ level: 'silent' }),
        browser: ["Ubuntu", "Chrome", "20.0.04"] // تعريف المتصفح مطلوب لهذه الطريقة
    });

    // طلب كود الربط إذا لم يكن الحساب مسجلاً مسبقاً
    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(`\n========================================`);
                console.log(`📱 كود الربط الخاص بك هو: ${code}`);
                console.log(`========================================\n`);
                console.log(`خطوات الربط:`);
                console.log(`1. افتح واتساب في هاتفك.`);
                console.log(`2. اذهب إلى (الأجهزة المرتبطة).`);
                console.log(`3. اضغط (ربط جهاز) ثم اختر (الربط برقم هاتف بدلاً من ذلك).`);
                console.log(`4. أدخل الكود الموضح بالأعلى.`);
            } catch (error) {
                console.error("حدث خطأ أثناء طلب كود الربط:", error);
            }
        }, 3000);
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== 401;
            console.log('تم فصل الاتصال. جاري إعادة المحاولة...', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ تم الاتصال بنجاح! البوت يعمل الآن.');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        
        if (!msg.message || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        const textMessage = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (textMessage) {
            console.log(`تم استلام رسالة من ${sender}: ${textMessage}`);

            await randomDelay();

            const replyText = "مرحباً بك في خدمات الحداد للسفر والسياحة! ✈️\nلقد استلمنا رسالتك وسنرد عليك في أقرب وقت.\n\nمع تحيات:\nأبو مجد الحداد وجميع موظفيه";

            await sock.sendMessage(sender, { text: replyText }, { quoted: msg });
        }
    });
}

startBot();
