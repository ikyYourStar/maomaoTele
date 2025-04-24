const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  name: 'stiker',
  role: 0,
  category: "utility",
  author: "Rizky",
  version: "1.0",
  Maomao: async function ({ bot, chatId, msg, args }) {
    const reply = msg.reply_to_message;
    const packName = args[0] || "MaoPack";

    if (!reply || !reply.photo) {
      return bot.sendMessage(chatId, "Balas foto dengan perintah:\nstiker (namaPack)");
    }

    try {
      // Ambil file ID foto resolusi tertinggi
      const photo = reply.photo[reply.photo.length - 1];
      const file = await bot.getFile(photo.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

      // Download gambar ke sementara
      const filePath = path.join(__dirname, "temp", `${Date.now()}.jpg`);
      const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, response.data);

      // Kirim sebagai sticker
      await bot.sendSticker(chatId, filePath, {
        reply_to_message_id: msg.message_id
      });

      fs.unlinkSync(filePath); // Hapus setelah dikirim
    } catch (err) {
      console.error("Gagal mengubah gambar jadi stiker:", err);
      bot.sendMessage(chatId, "Terjadi kesalahan saat membuat stiker.");
    }
  }
};