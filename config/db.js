/**
 * Created by Farhan 02/20/17.
 */

var Sequelize = require("sequelize");
var Logger = require("../utilities/logger");
var config = require("./config.js");

var dbURI = config.dbURI;

Logger.log("debug", "DB URI");
Logger.log("debug", dbURI);

var db = new Sequelize(dbURI, {
  // disable logging; default: console.log
  logging: false,
  dialectOptions: {
    charset: "utf8",
    collate: "utf8_general_ci",
  },
  // define: {
  //     timestamps: false
  // },
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
    Logger.log("info", "Connection has been established successfully.");
    return null;
  })
  .catch(function (err) {
    Logger.log("error", "Unable to connect to the database:", err);
  });

module.exports = db;
