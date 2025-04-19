const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');


const tokenPath = path.join(__dirname, 'TOKEN.txt');
const token = fs.readFileSync(tokenPath, 'utf-8').trim();

const bot = new TelegramBot(token, { polling: true });

/*
SCRIPT BY REYHAN6610 or RENDYX
Kalok mau rekode atau rename tag me
@rendyx_solo-player

🇲🇨 INI CODE NYA SUPORT CHAT GBT YA JADI COCOK BUAT PEMULA👋

*/


console.log('REYHAN IYHIIIIR🤓');


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const imagePath = path.join(__dirname, 'img', 'main.png');
    const caption = `╭─────❒ 「 𝐌𝐄𝐍𝐔 」
│
│⊳ /info_my
│⊳ /send1 [jumlah]
│⊳ /send2
│⊳ /virtex1
│⊳ /virtex2
│⊳ /virtex3
│⊳ /virtex4
│⊳ /virtex5
│⊳ /send_button
│⊳ /about
│☆ᴍɪɴɪ ʙᴀsᴇᴅ☆
└──────────❒`;

    bot.sendPhoto(chatId, imagePath, { caption });
});

bot.onText(/\/info_my/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.username || "Tidak ada username";
    const fullName = `${msg.from.first_name || ''} ${msg.from.last_name || ''}`.trim();
    const time = new Date().toLocaleString();

    const infoMessage = `
╭──────────❒
│ ${"🌟 𝐈𝐍𝐅𝐎 𝐌𝐘 🌟"}
╰──────────❒
      
┌─❒ CHAT ID   : ${chatId}
│
│⊳ NAMA       : ${fullName || 'Tidak ada nama'}
│⊳ USER       : ${userName}
│⊳ WAKTU      : ${time}
└────────────❒
`;

    bot.sendMessage(chatId, infoMessage);
});


bot.onText(/\/virtex1/, (msg) => {
    const chatId = msg.chat.id;
    const filePath = path.join(__dirname, 'lib', 'crash.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return bot.sendMessage(chatId, 'Terjadi kesalahan saat mengambil file.');
        }

        bot.sendMessage(chatId, data);
    });
});

bot.onText(/\/virtex2/, (msg) => {
    const chatId = msg.chat.id;
    const filePath = path.join(__dirname, 'lib', 'xsuper_Crash.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return bot.sendMessage(chatId, 'Terjadi kesalahan saat mengambil file.');
        }

        bot.sendMessage(chatId, data);
    });
});

bot.onText(/\/virtex3/, (msg) => {
    const chatId = msg.chat.id;
    const filePath = path.join(__dirname, 'lib', 'virtex3.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return bot.sendMessage(chatId, 'Terjadi kesalahan saat mengambil file.');
        }

        bot.sendMessage(chatId, data);
    });
});

bot.onText(/\/virtex4/, (msg) => {
    const chatId = msg.chat.id;
    const filePath = path.join(__dirname, 'lib', 'virtex.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return bot.sendMessage(chatId, 'Terjadi kesalahan saat mengambil file.');
        }

        bot.sendMessage(chatId, data);
    });
});

bot.onText(/\/virtex5/, (msg) => {
    const chatId = msg.chat.id;
    const filePath = path.join(__dirname, 'lib', 'virtex2.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return bot.sendMessage(chatId, 'Terjadi kesalahan saat mengambil file.');
        }

        bot.sendMessage(chatId, data);
    });
});

bot.onText(/\/send_button/, (msg) => {
    const chatId = msg.chat.id;

    const options = {
        reply_markup: {
            keyboard: [
                [{ text: 'Button 1' }],
                [{ text: 'Button 2' }],
                [{ text: 'Button 3' }],
                [{ text: 'Button 4' }],
                [{ text: 'Button 5' }]
            ],
            one_time_keyboard: true, 
            resize_keyboard: true, 
        }
    };

    bot.sendMessage(chatId, 'Pilih salah satu tombol:', options);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    
    if (text === 'Button 1') {
        bot.sendMessage(chatId, 'Tombol 1 dipilih');
    } else if (text === 'Button 2') {
        bot.sendMessage(chatId, 'Tombol 2 dipilih');
    } else if (text === 'Button 3') {
        bot.sendMessage(chatId, 'Tombol 3 dipilih');
    } else if (text === 'Button 4') {
        bot.sendMessage(chatId, 'Tombol 4 dipilih');
    } else if (text === 'Button 5') {
        bot.sendMessage(chatId, 'Tombol 5 dipilih');
    }
});

bot.onText(/\/send1 (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const jumlahPesan = parseInt(match[1]);

    if (isNaN(jumlahPesan) || jumlahPesan <= 0) {
        return bot.sendMessage(chatId, 'Harap masukkan jumlah pesan yang valid (lebih besar dari 0).');
    }

    
    for (let i = 0; i < jumlahPesan; i++) {
        setTimeout(() => {
            bot.sendMessage(chatId, 'Hello World');
        }, i * 1000);  
    }
});

bot.onText(/\/send2/, (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    
    bot.sendMessage(chatId, 'Halo Indonesia', { reply_to_message_id: messageId });
});

bot.onText(/\/about/, (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id; 

    
    const aboutMessage = `
𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 𝐁𝐀𝐒𝐄 𝟏.𝟎

🔷️ Codex = Reyhan6610
🔷️ VERSI = 1.0
🔷️ NAME = BASE
🔷️ LAST UPDATE = JUM, 29 NOV
@Gray_Hat_anon
`;

    
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Developer', url: 'https://youtube.com/@rendyx_solo-player?si=3-2UDzYjUBJNmENn' }]
            ]
        }
    };

    
    bot.sendPhoto(chatId, path.join(__dirname, 'img', 'reyhan6610.png'), {
        caption: aboutMessage, 
        reply_to_message_id: messageId,
        ...options
    });
});


