// money.js
const userDB = require("../maoDB/maomaoDB");

module.exports = {
  name: "money",
  author: "Rizky",
  version: "1.0",
  role: 0,
  category: "economy",
  Maomao: async function ({ bot, chatId, msg }) {
    const uid = msg.from.id.toString();
    const name = msg.from.first_name;

    await userDB.initDB();

    let user = await userDB.getUser(uid);

    if (!user) {
      await userDB.createUser(uid, name);
      return bot.sendMessage(chatId, `Akun kamu berhasil dibuat dengan saldo awal $100`);
    }

    const saldo = await userDB.getMoney(uid);
    return bot.sendMessage(chatId, `Saldo kamu sekarang: $${saldo}`);
  }
};