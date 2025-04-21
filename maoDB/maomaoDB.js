const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, { users: [] });

async function initDB() {
  await db.read();
  if (!db.data) {
    db.data = { users: [] };
    await db.write();
  }
}

async function getUser(uid) {
  await db.read();
  return db.data.users.find(user => user.uid === uid);
}

async function getAllUsers() {
  await db.read();
  return db.data.users || [];
}

async function createUser(uid, name) {
  await db.read();
  if (!db.data.users.find(user => user.uid === uid)) {
    db.data.users.push({
      uid,
      name,
      money: 100,
      role: 'free',
      exp: 0,
      level: 1,
      lastClaim: 0
    });
    await db.write();
  }
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

async function getRole(uid) {
  const user = await getUser(uid);
  return user?.role || 'free';
}

async function isPremium(uid) {
  const user = await getUser(uid);
  return user?.role === 'premium' && (user.premiumUntil === undefined || user.premiumUntil > Date.now());
}

async function setPremium(uid, premiumUntil = undefined) {
  await db.read();
  const user = db.data.users.find(user => user.uid === uid);
  if (user) {
    user.role = 'premium';
    user.money += 7000000;
    user.premiumUntil = premiumUntil;
    await db.write();
    return true;
  }
  return false;
}

async function checkPremiumExpiration() {
  await db.read();
  if (db.data && db.data.users) {
    db.data.users = db.data.users.map(user => {
      if (user.role === 'premium' && user.premiumUntil !== undefined && user.premiumUntil <= Date.now()) {
        user.role = 'free';
        delete user.premiumUntil;
      }
      return user;
    });
    await db.write();
  }
}

async function addExp(uid, amount) {
  await db.read();
  const user = db.data.users.find(user => user.uid === uid);
  if (!user) return;

  user.exp = (user.exp || 0) + amount;

  while (user.exp >= 100) {
    user.exp -= 100;
    user.level = (user.level || 1) + 1;
  }

  await db.write();
}

async function getExp(uid) {
  const user = await getUser(uid);
  return user?.exp || 0;
}

async function getLevel(uid) {
  const user = await getUser(uid);
  return user?.level || 1;
}

// === Tambahan untuk daily reward ===
async function getLastClaim(uid) {
  const user = await getUser(uid);
  return user?.lastClaim || 0;
}

async function setLastClaim(uid, timestamp) {
  await db.read();
  const user = db.data.users.find(user => user.uid === uid);
  if (user) {
    user.lastClaim = timestamp;
    await db.write();
  }
}

// EXPORT
module.exports = {
  initDB,
  getUser,
  getAllUsers,
  createUser,
  getMoney,
  setMoney,
  getRole,
  isPremium,
  setPremium,
  checkPremiumExpiration,
  addExp,
  getExp,
  getLevel,
  getLastClaim,
  setLastClaim
};