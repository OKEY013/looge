const { Sequelize } = require('sequelize');

// Database configuration based on environment
const dbConfig = {
  // MySQL configuration (production)
  mysql: {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'looge_db',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  // SQLite configuration (development)
  sqlite: {
    dialect: 'sqlite',
    storage: process.env.SQLITE_DB_PATH || './database.db',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
};

// Choose database based on environment
const useMySQL = process.env.DB_DIALECT === 'mysql' && process.env.DB_HOST;
const sequelize = new Sequelize(useMySQL ? dbConfig.mysql : dbConfig.sqlite);

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log(`Database connected successfully (${useMySQL ? 'MySQL' : 'SQLite'})`);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = { sequelize };
