const db = require("../maoDB/maomaoDB");

module.exports = {
  name: "slot",
  author: "Rizky",
  version: "1.0",
  role: 0,
  category: "games",
  Maomao: async function ({ bot, chatId, msg, args }) {
    const uid = msg.from.id.toString();
    const name = msg.from.first_name;

    await db.initDB();
    let user = await db.getUser(uid);
    if (!user) {
      await db.createUser(uid, name);
      user = await db.getUser(uid);
    }

    const bet = parseInt(args[0]);
    if (isNaN(bet) || bet <= 0) return bot.sendMessage(chatId, "Masukkan jumlah uang yang valid untuk bertaruh.");

    if (user.money < bet) return bot.sendMessage(chatId, `Uang kamu tidak cukup untuk bertaruh $${bet}.`);

    const slotItems = ["🍒", "🍋", "🍊", "🍉", "⭐", "7️⃣"];
    const roll = () => slotItems[Math.floor(Math.random() * slotItems.length)];
    const result = [roll(), roll(), roll()];
    const isWin = result[0] === result[1] && result[1] === result[2];

    let message = `🎰 | ${result.join(" | ")}\n`;

    if (isWin) {
      const reward = bet * 2;
      await db.setMoney(uid, user.money + reward);
      message += `Selamat! Kamu menang dan mendapatkan $${reward}.`;
    } else {
      await db.setMoney(uid, user.money - bet);
      message += `Yah, kamu kalah dan kehilangan $${bet}.`;
    }

    bot.sendMessage(chatId, message);
  }
};