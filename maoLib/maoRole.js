const fs = require('fs');
const path = require('path');
const MaoStg = JSON.parse(fs.readFileSync(path.join(__dirname, '../MaoStg.json'), 'utf-8'));

/**
 * Mengecek role user berdasarkan ID dan tipe chat.
 * 
 * @param {number} userId - ID Telegram user.
 * @param {object} bot - Bot instance dari node-telegram-bot-api.
 * @param {number} chatId - ID Telegram grup atau user chat.
 * @returns {number} - Role: 0 (semua), 1 (admin grup), 2 (admin bot).
 */
async function cekRole(userId, bot, chatId) {
  // 2 = Admin bot
  if (Array.isArray(MaoStg.admin) && MaoStg.admin.includes(userId)) {
    return 2;
  }

  // Cek admin grup kalau chat grup
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

  // Default: user biasa
  return 0;
}

module.exports = cekRole;