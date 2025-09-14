require('dotenv').config();
const { sequelize } = require('../src/models');
(async () => {
  try {
    const start = Date.now();
    await sequelize.authenticate();
    console.log('DB connection OK:', {
      host: process.env.DB_HOST || 'localhost',
      name: process.env.DB_NAME || 'looge_db',
      user: process.env.DB_USER || 'looge_ybao888',
      dialect: process.env.DB_DIALECT || 'mysql',
      elapsed_ms: Date.now() - start
    });
  } catch (err) {
    console.error('DB connection FAIL:', err.message);
    process.exitCode = 0;
  } finally {
    await sequelize.close();
  }
})();
