const fs = require('fs');
const path = require('path');
const MaoStg = JSON.parse(fs.readFileSync(path.join(__dirname, '../MaoStg.json'), 'utf-8'));

async function cekRole(userId, bot, chatId) {
  if (Array.isArray(MaoStg.admin) && MaoStg.admin.includes(userId)) {
    return 2;
  }

  if (chatId < 0) {
    try {
      const member = await bot.getChatMember(chatId, userId);
      if (['administrator', 'creator'].includes(member.status)) {
        return 1;
      }
    } catch (e) {
      console.error('Gagal cek admin grup:', e);
    }
  }

  return 0;
}

module.exports = cekRole;