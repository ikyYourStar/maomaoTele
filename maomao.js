const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const { log, logStartMessage } = require('./maoLib/log/log');
const open = require('open');
const { exec } = require('child_process');
const os = require('os');
const express = require('express');
const cekRole = require('./maoLib/maoRole');

// Load konfigurasi
const config = JSON.parse(fs.readFileSync('MaoStg.json', 'utf-8'));
const token = config.token;
const prefix = config.prefix;

// Cek token
if (!token || token.trim() === '') {
  console.log("\n[!] Token bot belum diisi di file MaoStg.json");
  console.log("[!] Silakan buka BotFather di Telegram untuk mendapatkan token.");
  const platform = os.platform();
  if (platform === 'android') {
    exec('termux-open-url https://t.me/BotFather', (error) => {
      if (error) console.log("Gagal membuka browser, buka manual: https://t.me/BotFather");
    });
  } else {
    open('https://t.me/BotFather').catch(() => {
      console.log("Gagal membuka browser, buka manual: https://t.me/BotFather");
    });
  }
  process.exit(1);
}

// Start Telegram Bot
const bot = new TelegramBot(token, { polling: true });
logStartMessage();

// Web Server
const app = express();
const PORT = 3000;
const htmlPath = path.join(__dirname, 'maoLib', 'maoView.html');
const uptimePath = path.join(__dirname, 'maoLib', 'uptime.json');

// Set waktu start saat skrip dijalankan
const startTime = Date.now();

// Opsional: Simpan waktu start ke file jika perlu persistensi antar restart yang disengaja
// Untuk kasus "baru run langsung segitu", kita set startTime baru setiap kali skrip dijalankan.
// fs.writeFileSync(uptimePath, JSON.stringify({ startTime: startTime }));


app.get('/', (req, res) => {
  res.sendFile(htmlPath);
});

app.get('/uptime', (req, res) => {
  const uptimeMs = Date.now() - startTime;
  const seconds = Math.floor((uptimeMs / 1000) % 60);
  const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
  const hours = Math.floor((uptimeMs / (1000 * 60 * 60)));

  res.json({
    hours,
    minutes,
    seconds
  });
});

app.listen(PORT, () => {
  console.log(`[√] Webview aktif di http://localhost:${PORT}`);
  const platform = os.platform();
  if (platform === 'android') {
    exec(`termux-open-url http://localhost:${PORT}`, (error) => {
      if (error) console.log("Gagal membuka browser, buka manual: http://localhost:" + PORT);
    });
  } else {
    open(`http://localhost:${PORT}`).catch(() => {
      console.log("Gagal membuka browser, buka manual: http://localhost:" + PORT);
    });
  }
});

// Map untuk fitur bot
const replyJinshi = new Map();
const multiprefixStatus = new Map();
const commands = new Map();
const onChat = new Map();

// Load command
const commandsPath = path.join(__dirname, 'maomao-cmd');
fs.readdirSync(commandsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(`./maomao-cmd/${file}`);
    commands.set(command.name, command);
    onChat.set(file.replace('.js', ''), command);
  }
});

// Pesan masuk
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;
  const name = msg.from.first_name;
  const text = msg.text || '';

  const replyToMessageId = msg.reply_to_message?.message_id;
  if (replyToMessageId && replyJinshi.has(replyToMessageId)) {
    const data = replyJinshi.get(replyToMessageId);
    replyJinshi.delete(replyToMessageId);
    try {
      await data.execute({ bot, config, chatId, userId, username, name, msg, text });
    } catch (err) {
      log(`Error di onReply jinshi: ${err}`);
      bot.sendMessage(chatId, "Terjadi kesalahan saat memproses balasan.");
    }
    return;
  }

  for (const [name, handler] of onChat.entries()) {
    if (typeof handler.iky === 'function') {
      try {
        await handler.iky({ bot, config, chatId, userId, username, name, msg, text });
      } catch (err) {
        log(`Error di onChat [${name}]: ${err}`);
      }
    }
  }

  if (text.trim().toLowerCase() === 'prefix') {
    return bot.sendMessage(chatId, `Hi Sir my name is maomao🌸\n\n🌷My Prefix: ${prefix}\n🌹Default prefix: ${prefix}`, {
      reply_to_message_id: msg.message_id
    });
  }

  if (text.trim() === prefix) {
    return bot.sendMessage(chatId, `Ketik *${prefix}menu* untuk melihat daftar perintah bot!`, {
      reply_to_message_id: msg.message_id,
      parse_mode: 'Markdown'
    });
  }

  const role = await cekRole(userId, bot, chatId);

  let isCommand = false;
  let args = [];
  let commandName = '';
  let command = null;
  const mpStatus = multiprefixStatus.get(chatId) || false;

  if (text.startsWith(prefix)) {
    isCommand = true;
    args = text.slice(prefix.length).trim().split(/ +/);
    commandName = args.shift()?.toLowerCase() || '';
    command = commands.get(commandName);
  } else if (role >= 2 && mpStatus) {
    args = text.trim().split(/ +/);
    commandName = args.shift()?.toLowerCase() || '';
    command = commands.get(commandName);
    if (command) isCommand = true;
  }

  if (!isCommand || !command) return;

  const requiredRole = command.role || 0;
  if (role < requiredRole) {
    return bot.sendMessage(chatId, "Lu tuh bukan admin.");
  }

  try {
    await command.Maomao({
      bot,
      config,
      chatId,
      userId,
      username,
      name,
      args,
      msg,
      replyJinshi,
      role,
      multiprefixStatus
    });
  } catch (err) {
    log(`Terjadi error saat menjalankan perintah ${commandName}: ${err}`);
    bot.sendMessage(chatId, "Maaf, terjadi kesalahan saat menjalankan perintah.");
  }
});
