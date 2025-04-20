const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, { users: [] }); // <- tambahkan default data

async function initDB() {
  await db.read();
  db.data ||= { users: [] }; // jika kosong, buat array users
  await db.write();
}

async function getUser(uid) {
  await db.read();
  return db.data.users.find(user => user.uid === uid);
}

async function createUser(uid, name) {
  await db.read();
  db.data.users.push({ uid, name, money: 100 });
  await db.write();
}

async function getMoney(uid) {
  const user = await getUser(uid);
  return user?.money || 0;
}

async function setMoney(uid, money) {
  const user = await getUser(uid);
  if (user) {
    user.money = money;
    await db.write();
  }
}

module.exports = {
  initDB,
  getUser,
  createUser,
  getMoney,
  setMoney
};