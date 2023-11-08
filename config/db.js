

var Sequelize = require("sequelize");
var config = require("./config.js");

var dbURI = config.dbURI;

console.log("debug", "DB URI");
console.log("debug", dbURI);

var db = new Sequelize(dbURI, {
  // disable logging; default: console.log
  logging: false,
  dialectOptions: {
    charset: "utf8",
    collate: "utf8_general_ci",
  },
  pool: {
    max: 10,
    min: 5,
    acquire: 60000,
    idle: 10000,
  },
});

// test connection
db.authenticate()
  .then(function (err) {
    console.log("info", "Connection has been established successfully.");
    return null;
  })
  .catch(function (err) {
    console.log("error", "Unable to connect to the database:", err);
  });


module.exports = db;
