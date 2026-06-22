const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express'); // 🟢 استخدمنا Express لأنه أكثر استقراراً

// ==========================================
// 1. إعداد خادم الويب (لإبقاء البوت حياً في Render)
// ==========================================
const app = express();
app.get('/', (req, res) => res.send('🚀 الحداد للسفر والسياحة: البوت يعمل بكفاءة عالية!'));
app.listen(process.env.PORT || 8080, () => console.log('🌐 خادم الويب يعمل بنجاح.'));

// ==========================================
// 2. إعدادات البوت الأساسية
// ==========================================
const phoneNumber = "967737044480"; // رقمك بدون أصفار دولية أو علامة +
let isStarting = false;
let codeAttempts = 0; // عداد محاولات طلب الكود

// دالة لتأخير الوقت (محاكاة الكتابة والتفكير)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// 3. الحماية من الانهيار (Crash Protection)
// ==========================================
process.on('uncaughtException', (err) => console.error('⚠️ خطأ مفاجئ تم التقاطه (لن يتوقف البوت):', err));
process.on('unhandledRejection', (err) => console.error('⚠️ رفض مفاجئ تم التقاطه (لن يتوقف البوت):', err));

// ==========================================
// 4. الدالة الرئيسية لتشغيل البوت
// ==========================================
async function startBot() {
    if (isStarting) return;
    isStarting = true;

    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }), // إخفاء السجلات المزعجة
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        markOnlineOnConnect: true, // يظهر متصلاً
        generateHighQualityLinkPreviews: true
    });

    // 🟢 طلب كود الربط بذكاء (مع حد أقصى للمحاولات)
    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            if (codeAttempts >= 3) {
                console.log("🛑 تم إيقاف محاولات جلب الكود مؤقتاً لتجنب الحظر. يرجى إعادة تشغيل السيرفر لاحقاً.");
                return;
            }
            
            try {
                codeAttempts++;
                console.log(`⏳ جاري طلب كود الربط... (المحاولة ${codeAttempts})`);
                let code = await sock.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                
                console.log(`\n========================================`);
                console.log(`📱 كود الربط الخاص بك هو: ${code}`);
                console.log(`========================================\n`);
                console.log(`قم بإدخال الكود في واتساب عبر "ربط جهاز" -> "الربط برقم هاتف".\n`);
                codeAttempts = 0; // تصفير العداد عند النجاح
            } catch (error) {
                console.log("❌ فشل في جلب الكود. سيتم المحاولة لاحقاً.");
                console.error("سبب الفشل:", error?.message || error);
            }
        }, 8000); 
    }

    // 🟢 إدارة حالة الاتصال وإعادة التشغيل الذاتي
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            isStarting = false;
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const reason = statusCode || "غير معروف";
            console.log(`📡 تم إغلاق الاتصال، رمز السبب: ${reason}`);

            if (statusCode === DisconnectReason.loggedOut) {
                console.log("❌ تم تسجيل الخروج من الجهاز. يجب حذف مجلد auth_info_baileys وإعادة الربط.");
            } else if (statusCode === 428) {
                 console.log("⚠️ تم إغلاق الاتصال بشكل طبيعي. جارٍ التحديث...");
                 setTimeout(startBot, 3000);
            } else {
                console.log("♻️ محاولة إعادة الاتصال التلقائي...");
                setTimeout(startBot, 5000);
            }
        } else if (connection === 'open') {
            isStarting = false;
            console.log('✅ تم الاتصال بخوادم واتساب بنجاح! البوت مستعد لخدمة العملاء.');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // 🟢 معالجة الرسائل الواردة بذكاء
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return; // التأكد من أنها رسالة جديدة وليست تحديثاً قديماً
        
        const msg = messages[0];
        
        // تجاهل رسائلك الشخصية، ورسائل المجموعات، والحالات (Story)
        if (!msg.message || msg.key.fromMe || msg.key.remoteJid.includes('@g.us') || msg.key.remoteJid === 'status@broadcast') return;

        const sender = msg.key.remoteJid;
        const textMessage = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (textMessage) {
            console.log(`📩 رسالة من العميل: ${textMessage}`);

            try {
                // 1. قراءة الرسالة (علامة الصحين الزرقاء)
                await sock.readMessages([msg.key]);

                // 2. إظهار حالة "يكتب..." لمدة تتراوح بين 2 إلى 5 ثوانٍ
                await sock.sendPresenceUpdate('composing', sender);
                const typingTime = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
                await delay(typingTime);
                await sock.sendPresenceUpdate('paused', sender); // إيقاف "يكتب..."

                // 3. تجهيز الرد
                const replyText = "مرحباً بك في خدمات الحداد للسفر والسياحة! ✈️\nلقد استلمنا رسالتك وسنرد عليك في أقرب وقت.\n\nمع تحيات:\nأبو مجد الحداد وجميع موظفيه";

                // 4. إرسال الرسالة مع اقتباس رسالة العميل
                await sock.sendMessage(sender, { text: replyText }, { quoted: msg });
                console.log(`✅ تم الرد بنجاح.`);

            } catch (err) {
                console.error("⚠️ فشل في الرد على العميل:", err);
            }
        }
    });
}

// تشغيل البوت
startBot();
