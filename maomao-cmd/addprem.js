const userDB = require("../maoDB/maomaoDB");

module.exports = {
  name: "addprem",
  author: "Rizky",
  version: "1.3", // Naikkan versi lagi
  role: 2,
  category: "owner",

  Maomao: async function ({ bot, chatId, msg, args }) {
    await userDB.initDB();

    let targetId;
    let duration;

    if (args[0] === "me") {
      // Kasus: addprem me [durasi]
      targetId = msg.from.id.toString();
      duration = args[1];
    } else if (/^\d+$/.test(args[0])) {
      // Kasus: addprem <UID> [durasi]
      targetId = args[0];
      duration = args[1];
    } else if (msg.reply_to_message) {
      // Kasus: addprem (reply ke pesan orang) [durasi]
      targetId = msg.reply_to_message.from.id.toString();
      duration = args[1];
    } else {
      return bot.sendMessage(
        chatId,
        "Gunakan `addprem me [durasi]`, atau balas pesan pengguna diikuti durasi (contoh: 123456789 7d)."
      );
    }

    if (!targetId) {
      return bot.sendMessage(chatId, "Target pengguna tidak valid. Gunakan 'me' atau balas pesan pengguna.");
    }

    if (!duration) {
      return bot.sendMessage(chatId, "Sertakan durasi premium. Contoh: `addprem me 7d` (7 hari).");
    }

    const durationRegex = /^(\d+)([dh])$/;
    const durationMatch = duration.match(durationRegex);

    if (!durationMatch) {
      return bot.sendMessage(
        chatId,
        "Format durasi tidak valid. Gunakan angka diikuti 'd' (hari) atau 'h' (jam). Contoh: `7d` atau `24h`."
      );
    }

    const timeValue = parseInt(durationMatch[1]);
    const timeUnit = durationMatch[2];
    let premiumUntil;

    const now = Date.now();
    if (timeUnit === 'd') {
      premiumUntil = now + (timeValue * 24 * 60 * 60 * 1000); // Tambah hari dalam milisekon
    } else if (timeUnit === 'h') {
      premiumUntil = now + (timeValue * 60 * 60 * 1000); // Tambah jam dalam milisekon
    }

    const user = await userDB.getUser(targetId);
    if (!user) {
      return bot.sendMessage(chatId, `User dengan ID ${targetId} belum terdaftar.`);
    }

    const result = await userDB.setPremium(targetId, premiumUntil);
    if (result) {
      const isSelf = targetId === msg.from.id.toString();
      const formattedUntil = new Date(premiumUntil).toLocaleString('id-ID');
      return bot.sendMessage(
        chatId,
        `Berhasil memberikan akses premium kepada ${
          isSelf ? "dirimu sendiri" : "user dengan ID " + targetId
        } hingga ${formattedUntil}!`
      );
    } else {
      return bot.sendMessage(chatId, "Gagal memberikan premium. User mungkin tidak ditemukan.");
    }
  },
};