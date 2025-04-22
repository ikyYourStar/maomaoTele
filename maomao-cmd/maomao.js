const statusMap = new Map();

module.exports = {
  name: "maomao",

  // Fungsi command default jika dipanggil lewat prefix, misalnya -maomao
  Maomao: async function({ bot, chatId }) {
    await bot.sendMessage(chatId, "Ketik 'maomao'");
    statusMap.set(chatId, true); // Set agar chat selanjutnya dicek
  },

  // Fungsi onChat: dijalankan untuk semua pesan masuk
  iky: async function({ bot, chatId, text }) {
    if (!statusMap.has(chatId)) return;

    if (text.toLowerCase() === "maomao") {
      await bot.sendMessage(chatId, "Bot aktif");
      statusMap.delete(chatId); // Hapus status setelah respon
    }
  }
};