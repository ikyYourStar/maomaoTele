const fs = require("fs");
const path = require("path");

module.exports = {
  name: "status",
  author: "Rizky",
  version: "1.0",
  role: 0,
  category: "system",

  Maomao: async function({ bot, chatId, userId, username, name }) {
    const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    // Baca MaoStg.json
    const settingPath = path.join(__dirname, "../MaoStg.json");
    let roleUser = "Member";

    try {
      const data = JSON.parse(fs.readFileSync(settingPath, "utf-8"));
      if (data.admin === userId.toString()) {
        roleUser = "Admin";
      }
    } catch (err) {
      console.error("Gagal membaca MaoStg.json:", err);
    }

    const message = `╭───[ ✨ 𝗜𝗡𝗙𝗢 𝗔𝗞𝗨 ✨ ]───╮
│ 𝗡𝗮𝗺𝗮 : ${name}
│ 𝗨𝘀𝗲𝗿 : @${username || 'tidak ada'}
│ 𝗨𝗜𝗗  : ${userId}
│ 𝗥𝗼𝗹𝗲 : ${roleUser}
│ 𝗪𝗮𝗸𝘁𝘂 : ${waktu}
╰──────────────────╯`;

    bot.sendMessage(chatId, message);
  }
};