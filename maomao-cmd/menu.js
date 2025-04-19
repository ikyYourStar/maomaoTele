const fs = require("fs");
const path = require("path");

module.exports = {
  name: "menu",
  author: "Rizky",
  version: "1.1",
  role: 0,
  category: "system",

  Maomao: async function ({ bot, chatId, msg }) {
    const text = msg?.text || "";
    const args = text.trim().split(" ");
    const commandName = args.length > 1 ? args[1].toLowerCase() : null;

    const commandsDir = path.join(__dirname, "../maomao-cmd/");
    const files = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));

    const commandList = {};
    const allCommands = {};

    for (const file of files) {
      const commandPath = path.join(commandsDir, file);
      const command = require(commandPath);

      const name = command.name || file.replace(".js", "");
      const category = command.category || "uncategorized";

      allCommands[name.toLowerCase()] = command;

      if (!commandList[category]) commandList[category] = [];
      commandList[category].push(name);
    }

    if (commandName) {
      const cmd = allCommands[commandName];
      if (!cmd) {
        return bot.sendMessage(chatId, `Command *${commandName}* tidak ditemukan.`, { parse_mode: "Markdown" });
      }

      const msgText =
`*Informasi Command:* \`${commandName}\`

*Author:* ${cmd.author || "-"}
*Role:* ${cmd.role} (${cmd.role == 0 ? "Semua user" : cmd.role == 1 ? "Admin grup" : "Admin bot"})
*Kategori:* ${cmd.category || "Tidak ada"}
*Versi:* ${cmd.version || "1.0"}`;

      return bot.sendMessage(chatId, msgText, { parse_mode: "Markdown" });
    }

    let message = "*Daftar Perintah:*\n\n";
    for (const category in commandList) {
      message += `*${category}*\n`;
      commandList[category].forEach(cmd => {
        message += `- \`${cmd}\`\n`;
      });
      message += "\n";
    }

    bot.sendMessage(chatId, message.trim(), { parse_mode: "Markdown" });
  }
};