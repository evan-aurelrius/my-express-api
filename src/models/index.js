const Sequelize = require('sequelize')
const dbConfig = require('../config/db.config.js')

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
})

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables updated!');
  })
  .catch(err => {
    console.error('Error updating database:', err);
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('./user.model.js')(sequelize, Sequelize)
db.book = require('./book.model.js')(sequelize, Sequelize)

module.exports = db
