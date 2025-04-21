const userDB = require("../maoDB/maomaoDB");

module.exports = {
  name: "listprem",
  author: "Rizky",
  version: "1.0",
  role: 0, // Kita akan melakukan pengecekan premium di dalam fungsi Maomao
  category: "economy",
  description: "Menampilkan daftar pengguna premium dan tanggal berakhirnya.",

  Maomao: async function ({ bot, chatId, msg }) {
    const userId = msg.from.id.toString();

    await userDB.initDB();
    const isCallerPremium = await userDB.isPremium(userId);

    if (!isCallerPremium) {
      return bot.sendMessage(chatId, "Fitur ini hanya tersedia untuk pengguna Premium.");
    }

    const allUsers = await userDB.getAllUsers();
    const premiumUsers = allUsers.filter(user => user.role === 'premium' && user.premiumUntil !== undefined && user.premiumUntil > Date.now());

    if (premiumUsers.length === 0) {
      return bot.sendMessage(chatId, "Tidak ada pengguna premium saat ini.");
    }

    let premiumListText = "*Daftar Pengguna Premium:*\n\n";
    for (const user of premiumUsers) {
      const formattedUntil = new Date(user.premiumUntil).toLocaleString('id-ID');
      const userName = user.name || user.uid; // Gunakan nama jika ada, jika tidak gunakan UID
      premiumListText += `- ${userName} (ID: ${user.uid}) - Berakhir pada: ${formattedUntil}\n`;
    }

    return bot.sendMessage(chatId, premiumListText);
  },
};