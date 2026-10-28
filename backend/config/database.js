const path = require('path');
const fs = require('fs');

const DATA_FILE = path.join(__dirname, '..', 'data', 'db.json');

const initDatabase = () => {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    console.log('[Database] Initializing database with seed data...');
    const seed = require('../utils/seedData');
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    console.log('[Database] Database initialized successfully.');
  } else {
    console.log('[Database] Loaded existing database from:', DATA_FILE);
  }
};

module.exports = {
  DATA_FILE,
  initDatabase
};

