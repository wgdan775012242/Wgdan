pkg update && pkg upgrade -y
pkg install nodejs git -y
mkdir travel-bot
cd travel-bot
npm init -y
npm install @whiskeysockets/baileys pino qrcode-terminal
