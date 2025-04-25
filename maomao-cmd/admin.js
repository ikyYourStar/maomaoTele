const fs = require('fs');
const path = require('path');
const userDB = require('../maoDB/maomaoDB'); // ganti path sesuai file asli
const MaoStgPath = path.join(__dirname, '../MaoStg.json');

module.exports = {
  name: "admin",
  role: 2,
  version: "1.0",
  author: "Rizky",
  category: "owmer",
  Maomao: async function ({ bot, chatId, args }) {
    const sub = args[0];
    const targetInput = args[1]; // bisa UID asli atau fakeId

    if (!fs.existsSync(MaoStgPath)) {
      fs.writeFileSync(MaoStgPath, JSON.stringify({ admin: [] }, null, 2));
    }

    const MaoStg = JSON.parse(fs.readFileSync(MaoStgPath, 'utf-8'));
    if (!Array.isArray(MaoStg.admin)) MaoStg.admin = [];

    // cari UID asli dari fakeId jika perlu
    let realUid = targetInput;
    if (!/^\d{10,}$/.test(targetInput)) {
      const user = await userDB.getUserByFakeId(targetInput);
      if (!user) return bot.sendMessage(chatId, `FakeID ${targetInput} tidak ditemukan.`);
      realUid = user.uid;
    }

    if (sub === "add") {
      if (!realUid || isNaN(realUid)) {
        return bot.sendMessage(chatId, "Masukkan UID yang valid.");
      }

      if (MaoStg.admin.includes(realUid)) {
        return bot.sendMessage(chatId, "UID tersebut sudah menjadi admin.");
      }

      MaoStg.admin.push(realUid);
      fs.writeFileSync(MaoStgPath, JSON.stringify(MaoStg, null, 2));
      return bot.sendMessage(chatId, `Berhasil menambahkan UID ${realUid} sebagai admin.`);
    }

    if (sub === "delete") {
      if (!realUid || isNaN(realUid)) {
        return bot.sendMessage(chatId, "Masukkan UID yang valid.");
      }

      if (!MaoStg.admin.includes(realUid)) {
        return bot.sendMessage(chatId, "UID tidak ditemukan dalam daftar admin.");
      }

      MaoStg.admin = MaoStg.admin.filter(id => id !== realUid);
      fs.writeFileSync(MaoStgPath, JSON.stringify(MaoStg, null, 2));
      return bot.sendMessage(chatId, `Berhasil menghapus UID ${realUid} dari admin.`);
    }

    if (sub === "list") {
      if (MaoStg.admin.length === 0) {
        return bot.sendMessage(chatId, "Belum ada admin yang terdaftar.");
      }

      let text = "*Daftar Admin:*\n\n";
      for (const uid of MaoStg.admin) {
        try {
          const info = await bot.getChatMember(chatId, uid);
          const nama = info.user.first_name || "Tanpa Nama";
          const user = await userDB.getUser(uid);
          text += `• ${nama} (UID: ${uid}, FakeID: ${user?.fakeId ?? "?"})\n`;
        } catch {
          text += `• (Tidak ditemukan) (UID: ${uid})\n`;
        }
      }
      return bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    }

    return bot.sendMessage(chatId, "Format salah. Gunakan:\n- admin add <fakeid/uid>\n- admin delete <fakeid/uid>\n- admin list");
  }
};