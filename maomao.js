const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const { log, logStartMessage } = require('./lib/log/log'); // Import fungsi log

// Load config
const config = JSON.parse(fs.readFileSync('MaoStg.json', 'utf-8'));
const token = config.token;
const prefix = config.prefix;

// Bot start
const bot = new TelegramBot(token, { polling: true });
logStartMessage(); // Panggil fungsi untuk menampilkan logo dan info log

// Map untuk menyimpan context reply jinshi
const replyJinshi = new Map();

// Load commands
const commands = new Map();
const commandsPath = path.join(__dirname, 'maomao-cmd');

fs.readdirSync(commandsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(`./maomao-cmd/${file}`);
    commands.set(command.name, command);
  }
});

// Handle message
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;
  const name = msg.from.first_name;
  const text = msg.text || '';

  // Cek apakah pesan ini balasan dari reply jinshi
  const replyToMessageId = msg.reply_to_message?.message_id;
  if (replyToMessageId && replyJinshi.has(replyToMessageId)) {
    const data = replyJinshi.get(replyToMessageId);
    replyJinshi.delete(replyToMessageId); // hapus agar tidak duplikat
    try {
      await data.execute({
        bot,
        config,
        chatId,
        userId,
        username,
        name,
        msg,
        text
      });
    } catch (err) {
      log(`Error di onReply jinshi: ${err}`); // Gunakan fungsi log
      bot.sendMessage(chatId, "Terjadi kesalahan saat memproses balasan.");
    }
    return;
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
      replyJinshi // Berikan akses replyJinshi ke command
    });
  } catch (err) {
    log(`Terjadi error saat menjalankan perintah ${commandName}: ${err}`); // Gunakan fungsi log
    bot.sendMessage(chatId, "Maaf, terjadi kesalahan saat menjalankan perintah.");
  }
});