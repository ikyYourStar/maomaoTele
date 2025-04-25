const fs = require('fs');

module.exports = {
  name: "prefix",
  role: 2,
  category: "owner",
  version: "1.0",
  Maomao: async ({ bot, config, chatId, args }) => {
    if (!args[0]) {
      return bot.sendMessage(chatId, `Prefix saat ini: *${config.prefix}*\n\nGunakan perintah:\n*prefix [prefix_baru]* untuk mengganti.`, {
        parse_mode: "Markdown"
      });
    }

    const newPrefix = args[0];
    const path = "./MaoStg.json";
    const json = JSON.parse(fs.readFileSync(path, "utf-8"));
    json.prefix = newPrefix;
    fs.writeFileSync(path, JSON.stringify(json, null, 2));

    bot.sendMessage(chatId, `Prefix berhasil diubah menjadi: *${newPrefix}*`, {
      parse_mode: "Markdown"
    });
  }
};