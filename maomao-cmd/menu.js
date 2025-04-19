const fs = require("fs");
const path = require("path");

module.exports = {
  name: "menu",
  author: "Rizky",
  version: "1.0",
  role: 0,
  category: "system",
  Maomao: async function ({ bot, chatId }) {
    const commandsDir = path.join(__dirname, "../maomao-cmd/");
    const files = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));

    const commandList = {};

    for (const file of files) {
      const commandPath = path.join(commandsDir, file);
      const command = require(commandPath);

      const category = command.category || "uncategorized";
      const name = command.name || "noName";

      if (!commandList[category]) {
        commandList[category] = [];
      }

      commandList[category].push(name);
    }

    let message = "*Daftar Perintah:*\n\n";

    for (const category in commandList) {
      message += `*${category}*\n`;
      commandList[category].forEach(cmd => {
        message += `- ${cmd}\n`;
      });
      message += "\n";
    }

    bot.sendMessage(chatId, message.trim(), { parse_mode: "Markdown" });
  }
};