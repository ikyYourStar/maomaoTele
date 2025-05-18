module.exports = {
  name: 'multiprefix',
  role: 0,
  Maomao: async ({ bot, chatId, args, multiprefixStatus }) => {
    const option = args[0]?.toLowerCase();
    if (option === 'on') {
      multiprefixStatus.set(chatId, true);
      return bot.sendMessage(chatId, "Multiprefix berhasil diaktifkan di grup ini.");
    } else if (option === 'off') {
      multiprefixStatus.set(chatId, false);
      return bot.sendMessage(chatId, "Multiprefix berhasil dimatikan di grup ini.");
    } else {
      return bot.sendMessage(chatId, "Format salah. Gunakan: -multiprefix on/off");
    }
  }
};