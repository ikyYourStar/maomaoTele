const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const { log, logStartMessage } = require('./lib/log/log');
const open = require('open');
const { exec } = require('child_process');
const os = require('os');

const config = JSON.parse(fs.readFileSync('MaoStg.json', 'utf-8'));
const token = config.token;
const prefix = config.prefix;

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

const bot = new TelegramBot(token, { polling: true });
logStartMessage();

const replyJinshi = new Map();

const commands = new Map();
const commandsPath = path.join(__dirname, 'maomao-cmd');
fs.readdirSync(commandsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(`./maomao-cmd/${file}`);
    commands.set(command.name, command);
  }
});

const onChat = new Map();
const chatPath = path.join(__dirname, 'maomao-cmd');
if (fs.existsSync(chatPath)) {
  fs.readdirSync(chatPath).forEach(file => {
    if (file.endsWith('.js')) {
      const handler = require(`./maomao-cmd/${file}`);
      onChat.set(file.replace('.js', ''), handler);
    }
  });
}

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

  if (!text.startsWith(prefix)) return;

  const args = text.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = commands.get(commandName);
  if (!command) return;

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
      replyJinshi
    });
  } catch (err) {
    log(`Terjadi error saat menjalankan perintah ${commandName}: ${err}`);
    bot.sendMessage(chatId, "Maaf, terjadi kesalahan saat menjalankan perintah.");
  }
});