const userDB = require("../maoDB/maomaoDB");

module.exports = {
  name: "daily",
  cooldown: 5,
  role: 0,
  author: "iky",
  version: "1.0",
  category: "economy",
  Maomao: async ({ bot, chatId, msg, replyJinshi }) => {
    const userId = msg.from.id.toString();
    await userDB.initDB();

    const user = await userDB.getUser(userId);
    if (!user) {
      await userDB.createUser(userId, msg.from.first_name);
      return bot.sendMessage(chatId, "Akun kamu berhasil dibuat. Silakan kirim ulang perintah /daily.");
    }

    const now = Date.now();
    const lastClaim = await userDB.getLastClaim(userId);
    if (lastClaim && now - lastClaim < 24 * 60 * 60 * 1000) {
      const sisa = 24 * 60 * 60 * 1000 - (now - lastClaim);
      const jam = Math.floor(sisa / (1000 * 60 * 60));
      const menit = Math.floor((sisa % (1000 * 60 * 60)) / (1000 * 60));
      return bot.sendMessage(chatId, `Kamu sudah mengambil daily hari ini.\nCoba lagi dalam ${jam} jam ${menit} menit.`);
    }

    const replyMessage = await bot.sendMessage(chatId,
      `# 𝗗𝗮𝗶𝗹𝘆 𝗥𝗲𝘄𝗮𝗿𝗱\n\n- 𝗘𝘅𝗽: 5 experience\n- 𝗬𝗲𝗻: 2¥ money\n\nKirim salah satu: *exp* atau *yen* untuk memilih hadiah.`,
      { reply_to_message_id: msg.message_id }
    );

    replyJinshi.set(replyMessage.message_id, {
      type: "daily",
      userId,
      waktu: now,
      execute: async ({ bot, chatId, text }) => {
        const pilihan = text.toLowerCase().trim();
        if (pilihan !== "exp" && pilihan !== "yen") {
          return bot.sendMessage(chatId, "Pilihan tidak valid. Harus *exp* atau *yen*.");
        }

        if (pilihan === "exp") {
          await userDB.addExp(userId, 5);
          await userDB.setLastClaim(userId, now);
          return bot.sendMessage(chatId, "Kamu menerima 5 exp dari daily reward.");
        }

        if (pilihan === "yen") {
          const currentMoney = await userDB.getMoney(userId);
          const newMoney = currentMoney + 2;
          await userDB.setMoney(userId, newMoney);
          await userDB.setLastClaim(userId, now);
          return bot.sendMessage(chatId, "Kamu menerima 2¥ dari daily reward.");
        }
      }
    });
  }
};