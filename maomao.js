const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Load config
const config = JSON.parse(fs.readFileSync('MaoStg.json', 'utf-8'));
const token = config.token;
const prefix = config.prefix;

// Bot start
const bot = new TelegramBot(token, { polling: true });
console.log("Maomao telah diaktifkan.");

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
  if (!text.startsWith(prefix)) return;

  const args = text.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = commands.get(commandName);
  if (!command) return;

  try {
    await command.Maomao({
      bot,
      chatId,
      userId,
      username,
      name,
      args,
      msg
    });
  } catch (err) {
    console.error("Terjadi error:", err);
    bot.sendMessage(chatId, "Maaf, terjadi kesalahan saat menjalankan perintah.");
  }
});