const os = require('os');

module.exports = {
  name: "system",
  author: "Rizky",
  version: "1.0",
  role: 0,
  category: "system",
  Maomao: async function ({ bot, chatId, config }) {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const totalMem = os.totalmem() / 1024 / 1024;
    const uptime = process.uptime(); // dalam detik

    const formatUptime = (seconds) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      return `${h} jam ${m} menit ${s} detik`;
    };

    const start = Date.now();
    const pingMessage = await bot.sendMessage(chatId, "Mengecek System...");
    const ping = Date.now() - start;

    const msg = 
`*Informasi Sistem Bot*

*Nama Bot:* ${config.namabot}
*Prefix:* ${config.prefix}
*Ping:* ${ping}ms
*RAM Digunakan:* ${used.toFixed(2)} MB / ${totalMem.toFixed(2)} MB
*Uptime:* ${formatUptime(uptime)}
*Owner:* [${config.admin}](tg://user?id=${config.admin})

_Bot by ${config.nameAdmin}_`;

    bot.editMessageText(msg, {
      chat_id: chatId,
      message_id: pingMessage.message_id,
      parse_mode: "Markdown"
    });
  }
};
