const fs = require("fs");
const path = require("path");
const userDB = require("../maoDB/maomaoDB");

module.exports = {
  name: "status",
  author: "Rizky",
  version: "1.3",
  role: 0,
  category: "system",

  Maomao: async function ({ bot, chatId, msg }) {
    const userId = msg.from.id.toString();
    const username = msg.from.username;
    const name = msg.from.first_name;
    const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    const settingPath = path.join(__dirname, "../MaoStg.json");
    let roleUser = "Member";

    try {
      const data = JSON.parse(fs.readFileSync(settingPath, "utf-8"));
      if (data.admin === userId) {
        roleUser = "Admin";
      }
    } catch {}

    await userDB.initDB();
    let user = await userDB.getUser(userId);

    if (!user) {
      await userDB.createUser(userId, name);
      return bot.sendMessage(chatId, `Akun kamu berhasil dibuat dengan saldo awal $100`);
    }

    const fakeid = await userDB.getFakeId(userId);
    const saldo = await userDB.getMoney(userId);
    const userRole = await userDB.getRole(userId);
    const level = await userDB.getLevel(userId);
    const exp = await userDB.getExp(userId);

    const message = `╭───[ ✨ 𝗜𝗡𝗙𝗢 𝗔𝗞𝗨 ✨ ]───╮
│ 𝗡𝗮𝗺𝗮 : ${name}
│ 𝗨𝘀𝗲𝗿 : @${username || 'tidak ada'}
│ 𝗜𝗗 : ${fakeid}
│ 𝗥𝗼𝗹𝗲 : ${roleUser}
│ 𝗧𝘆𝗽𝗲  : ${userRole === 'premium' ? 'Premium' : 'Free'}
│ 𝗦𝗮𝗹𝗱𝗼 : $${saldo}
│ 𝗟𝗲𝘃𝗲𝗹 : ${level} (${exp}/100)
│ 𝗪𝗮𝗸𝘁𝘂 : ${waktu}
╰──────────────────╯`;

    const imageUrl = "https://raw.githubusercontent.com/ikyYourStar/maomaoTele/refs/heads/main/maomao-cmd/mao-img/maomaoabout.png";
    await bot.sendPhoto(chatId, imageUrl, { caption: message });
  }
};