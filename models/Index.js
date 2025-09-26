'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// console.log(" ENV:", env); 
const config = require(__dirname + '/../config/config')[env];
// console.log(" Loaded DB config for:", env);
// console.log(" Full config object:", config);

// Log each field for debugging
// console.log(" config.database:", config.database);
const db = {};

let sequelize;
if (config.use_env_variable) {
  console.log(config.use_env_variable)
  sequelize = new Sequelize(process.env[config.use_env_variable], );
  sequelize.authenticate()
  .then(() => console.log(" DB connection test successful"))
  .catch(err => console.error(" DB connection failed in Index.js:", err));
  // console.log(" Loaded DB config for:", env);
// console.log(config);
} else {
  (async () => {
    try {
 //     console.log(" Starting Sequelize initialization...");
sequelize = new Sequelize(
  "inventory_db",        // database
  "root",                // username
  "root",                // password
  {
    host: "127.0.0.1",
    port: 1050,           //  confirmed reachable from CLI
    dialect: "mysql",
   // logging: 'false', // Optional: or false
    dialectOptions: {
      connectTimeout: 10000  // Fail fast if unreachable
    },
    pool: {
      acquire: 10000,
      idle: 10000
    }
  }
);
      /*
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
  port: config.port,
  dialect: config.dialect || 'mysql',
    dialectOptions: {
      connectTimeout: 5000 // 5 seconds timeout to catch hangs
  },
logging: console.log,
});
*/
  // console.log(" Sequelize instance created");
 await sequelize.authenticate()
  .then(() => console.log(" DB connection test successful"))
  .catch(err => console.error(" DB connection failed in Index.js:", err));
 // console.log(" Loaded DB config for:", env);
//console.log(config);
} catch (err) {
    console.error(" Sequelize init or auth failed:", err);
  }
})()
};
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1 &&
    file.indexOf('.') !== 0 &&
    file.toLowerCase() !== path.basename(__filename).toLowerCase() &&
     file.endsWith('.js') &&
    !file.endsWith('.test.js') &&
    file !== 'Index.js' &&
    file !== 'models.js' // <-- exclude models.js
    
    );
  })
  .forEach(file => {

   
   // const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    //db[model.name] = model;
    try {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    } catch (err) {
      console.error(`Failed to load model file: ${file}`, err);
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//console.log(Object.keys(db)); // should include: Item, ItemType
// console.log('Associations for Item:', db.Item.associations);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
