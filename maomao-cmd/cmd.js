const fs = require("fs");
const path = require("path");

module.exports = {
  name: "cmd",
  author: "Rizky",
  version: "2.0",
  role: 2,
  category: "system",

  Maomao: async function ({ bot, chatId, msg }) {
    const text = msg?.text || "";
    const args = text.trim().split(" ");
    const subcommand = args[1];
    const commandsDir = path.join(__dirname, "../maomao-cmd/");

    if (!subcommand) {
      return bot.sendMessage(chatId, "Gunakan:\n- `cmd install <nama.js> <kode>`\n- `cmd delete <nama.js>`\n- `cmd reload`", { parse_mode: "Markdown" });
    }

    // INSTALL
    if (subcommand === "install") {
      const fileName = args[2];
      if (!fileName || !fileName.endsWith(".js")) {
        return bot.sendMessage(chatId, "Gunakan format: `cmd install nama.js <kode>`", { parse_mode: "Markdown" });
      }

      const codeStartIndex = text.indexOf(fileName) + fileName.length;
      const code = text.slice(codeStartIndex).trim();

      if (!code.includes("module.exports") || !code.includes("Maomao")) {
        return bot.sendMessage(chatId, "Kode tidak valid. Harus mengandung `module.exports` dan `Maomao`.", { parse_mode: "Markdown" });
      }

      const filePath = path.join(commandsDir, fileName);
      try {
        fs.writeFileSync(filePath, code);
        return bot.sendMessage(chatId, `Command *${fileName}* berhasil diinstal. Gunakan \`cmd reload\` untuk memuatnya.`, { parse_mode: "Markdown" });
      } catch (err) {
        return bot.sendMessage(chatId, `Gagal menyimpan file: ${err.message}`);
      }
    }

    // DELETE
    if (subcommand === "delete") {
      const targetFile = args[2];
      if (!targetFile || !targetFile.endsWith(".js")) {
        return bot.sendMessage(chatId, "Gunakan format: `cmd delete nama.js`", { parse_mode: "Markdown" });
      }

      const filePath = path.join(commandsDir, targetFile);
      if (!fs.existsSync(filePath)) {
        return bot.sendMessage(chatId, `File *${targetFile}* tidak ditemukan.`, { parse_mode: "Markdown" });
      }

      try {
        fs.unlinkSync(filePath);
        return bot.sendMessage(chatId, `File *${targetFile}* berhasil dihapus.`, { parse_mode: "Markdown" });
      } catch (err) {
        return bot.sendMessage(chatId, `Gagal menghapus file: ${err.message}`);
      }
    }

    // RELOAD
    if (subcommand === "reload") {
      const files = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));
      for (const file of files) {
        const filePath = path.join(commandsDir, file);
        delete require.cache[require.resolve(filePath)];
      }
      return bot.sendMessage(chatId, `Berhasil me-*reload* ${files.length} command.`, { parse_mode: "Markdown" });
    }

    return bot.sendMessage(chatId, "Subcommand tidak dikenal. Gunakan: `install`, `delete`, atau `reload`.", { parse_mode: "Markdown" });
  }
};