const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'bot.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Gagal nulis log:', err);
    }
  });
}

function logStartMessage() {
  console.log(`█▀▄▀█ ▄▀█ █▀█ █▀▄▀█ ▄▀█ █▀█\n█   █ █▀█ █▄█ █   █ █▀█ █▄█`);
}

module.exports = { log, logStartMessage };