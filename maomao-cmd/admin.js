const fs = require('fs');  
const path = require('path');  
const MaoStgPath = path.join(__dirname, '../MaoStg.json');  
  
module.exports = {  
  name: "admin",  
  role: 2,  
  version: "1.0",  
  author: "Rizky",  
  category: "owmer",  
  Maomao: async function ({ bot, chatId, args, userId, name }) {  
    const sub = args[0];  
    const targetUid = args[1];  
  
    if (!fs.existsSync(MaoStgPath)) {  
      fs.writeFileSync(MaoStgPath, JSON.stringify({ admin: [] }, null, 2));  
    }  
  
    const MaoStg = JSON.parse(fs.readFileSync(MaoStgPath, 'utf-8'));  
    if (!Array.isArray(MaoStg.admin)) MaoStg.admin = [];  
  
    if (sub === "add") {  
      if (!targetUid || isNaN(targetUid)) {  
        return bot.sendMessage(chatId, "Masukkan UID yang valid.");  
      }  
  
      if (MaoStg.admin.includes(targetUid)) {  
        return bot.sendMessage(chatId, "UID tersebut sudah menjadi admin.");  
      }  
  
      MaoStg.admin.push(targetUid);  
      fs.writeFileSync(MaoStgPath, JSON.stringify(MaoStg, null, 2));  
      return bot.sendMessage(chatId, `Berhasil menambahkan UID ${targetUid} sebagai admin.`);  
    }  
  
    if (sub === "delete") {  
      if (!targetUid || isNaN(targetUid)) {  
        return bot.sendMessage(chatId, "Masukkan UID yang valid.");  
      }  
  
      if (!MaoStg.admin.includes(targetUid)) {  
        return bot.sendMessage(chatId, "UID tidak ditemukan dalam daftar admin.");  
      }  
  
      MaoStg.admin = MaoStg.admin.filter(id => id !== targetUid);  
      fs.writeFileSync(MaoStgPath, JSON.stringify(MaoStg, null, 2));  
      return bot.sendMessage(chatId, `Berhasil menghapus UID ${targetUid} dari admin.`);  
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
          text += `• ${nama} (${uid})\n`;  
        } catch {  
          text += `• (Tidak ditemukan) (${uid})\n`;  
        }  
      }  
      return bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });  
    }  
  
    return bot.sendMessage(chatId, "Format salah. Gunakan:\n- admin add <uid>\n- admin delete <uid>\n- admin list");  
  }  
};