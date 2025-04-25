const fs = require('fs');
const path = require('path');

const emojiPath = path.join(__dirname, '../emoji');
if (!fs.existsSync(emojiPath)) fs.mkdirSync(emojiPath);

module.exports = {
  name: "emoji",
  version: "1.0",
  role: 0,
  category: "fun",
  Maomao: async ({ bot, chatId, msg }) => {
    const reply = msg?.reply_to_message;
    const text = msg.text;

    // Deteksi tambah emoji dari reply
    if (reply?.photo && text.startsWith("(") && text.endsWith(")")) {
      const emojiName = text.slice(1, -1);
      const file = await bot.downloadFile(reply.photo[reply.photo.length - 1].file_id, "./emoji");
      fs.renameSync(file, `${emojiPath}/${emojiName}.jpg`);
      return bot.sendMessage(chatId, `Emoji :${emojiName}: berhasil ditambahkan!`);
    }

    // Deteksi pemanggilan emoji
    const matches = text.match(/:([a-zA-Z0-9_]+):/g);
    if (matches) {
      for (let match of matches) {
        const name = match.slice(1, -1);
        const filePath = `${emojiPath}/${name}.jpg`;
        if (fs.existsSync(filePath)) {
          await bot.sendPhoto(chatId, filePath);
        }
      }
    }
  }
};