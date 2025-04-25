const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getMoney, setMoney, createUser } = require('../maoDB/maomaoDB');

const ksrDBPath = path.join(__dirname, '../maoDB/ksr.json');
if (!fs.existsSync(ksrDBPath)) fs.writeFileSync(ksrDBPath, JSON.stringify({}));

module.exports = {
  name: "ksr",
  version: "1.0",
  role: 0,
  category: "games",
  Maomao: async ({ bot, chatId, userId, msg, args }) => {
    userId = userId.toString();
    const name = msg.from.first_name;

    const db = JSON.parse(fs.readFileSync(ksrDBPath, 'utf-8'));
    if (!db[userId]) db[userId] = [];

    await createUser(userId, name);

    const sub = args[0];

    if (!sub || sub === "pull") {
      const money = await getMoney(userId);
      if (money < 9) return bot.sendMessage(chatId, "Uang kamu tidak cukup untuk melakukan pull (butuh $9).");

      const res = await axios.get('https://raw.githubusercontent.com/ikyYourStar/ksr-api/main/ksr.json');
      const cards = res.data;

      const sorted = cards.sort(() => Math.random() - 0.5);
      let selected;

      for (let card of sorted) {
        const chance = Math.random() * 100;
        if (chance <= parseFloat(card.rate)) {
          selected = card;
          break;
        }
      }

      if (!selected) selected = sorted[0];

      db[userId].push(selected);
      fs.writeFileSync(ksrDBPath, JSON.stringify(db, null, 2));

      await setMoney(userId, money - 9);

      return bot.sendPhoto(chatId, selected.ibb, {
        caption: `Nama: ${selected.nama}\nBintang: ${selected.bint}\nHarga: $${selected.harga}`
      });
    }

    if (sub === "inv") {
      const page = parseInt(args[1]) || 1;
      const userCards = db[userId];
      if (userCards.length === 0) return bot.sendMessage(chatId, "Kamu belum punya kartu.");

      const start = (page - 1) * 5;
      const end = page * 5;
      const sliced = userCards.slice(start, end);

      const result = sliced.map((c, i) =>
        `(${start + i + 1}) ${c.nama} | ${c.bint} | ID: ${c.id} | Harga: $${c.harga}`
      ).join("\n");

      return bot.sendMessage(chatId, `Kartu milikmu (halaman ${page}):\n${result}`);
    }

    if (sub === "sell") {
      const idToSell = args[1];
      if (!idToSell) return bot.sendMessage(chatId, "Gunakan: ksr sell (id)");

      const userCards = db[userId];
      const index = userCards.findIndex(c => c.id === idToSell);

      if (index === -1) return bot.sendMessage(chatId, "Kartu tidak ditemukan.");

      const card = userCards[index];
      userCards.splice(index, 1);
      fs.writeFileSync(ksrDBPath, JSON.stringify(db, null, 2));

      const currentMoney = await getMoney(userId);
      await setMoney(userId, currentMoney + parseInt(card.harga));

      return bot.sendMessage(chatId, `Kartu ${card.nama} berhasil dijual seharga $${card.harga}.`);
    }

    return bot.sendMessage(chatId, "Gunakan: ksr pull | ksr inv [halaman] | ksr sell [id]");
  }
};