/**
 * Created by Vinod
 */

var Sequelize = require("sequelize");
var db = require("../config/db");

var ApiKeys = db.define(
  "chef_users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING(500),
    },
    apikey: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING(500),
      unique: "compositeIndex",
    },
    adminid: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    appname: {
      type: Sequelize.STRING,
    },
    apptype: {
      type: Sequelize.STRING,
    },
    publicurl: {
      type: Sequelize.STRING,
    },
    contactname: {
      type: Sequelize.STRING,
    },
    contactemail: {
      type: Sequelize.STRING,
    },
    contactmobileno: {
      type: Sequelize.STRING,
    },
    secretkey: {
      type: Sequelize.STRING,
    },
    inhouseapp: {
      type: Sequelize.STRING,
      defaultValue: "NO",
    },
    createdOn: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedOn: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    createdOn_str: {
      type: Sequelize.STRING,
    },
    updatedOn_str: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "ACTIVE",
    },
    createdBy: {
      type: Sequelize.STRING,
    },
    updatedBy: {
      type: Sequelize.STRING,
    },
    approvedrejectedby: {
      type: Sequelize.STRING,
    },
    createdOnLocal: {
      type: Sequelize.DATE,
    },
    createdOnLocal_str: {
      type: Sequelize.STRING,
    },
    updatedOnLocal: {
      type: Sequelize.DATE,
    },
    updatedOnLocal_str: {
      type: Sequelize.STRING,
    },
  },
  {
    // Other model options
  }
);

module.exports = ApiKeys;

module.exports.findOneAdminIdByAdminId = function (adminid, callback) {
  ApiKeys.findOne({
    where: { adminid: adminid },
  })
    .then(function (repo) {
      if (repo) {
        callback(null, repo);
      } else {
        callback({ error: "Adminid Not found", code: 404 }, repo);
      }
      return null;
    })
    .catch(function (err) {
      console.log("error", err);
      callback(
        { error: "Oops, Something went wrong (#EAKFOC1)", code: 500 },
        null
      );
    });
};

module.exports.findAllApiKeysByEnterpriseId = function (
  enterpriseid,
  callback
) {
  ApiKeys.findAll({
    where: { enterpriseid: enterpriseid },
    order: [["updatedOn", "DESC"]],
  })
    .then(function (rows) {
      if (rows.length > 0) {
        callback(null, rows);
      } else {
        callback({ error: "ApiKeys Not found", code: 404 }, rows);
      }
      return null;
    })
    .catch(function (err) {
      console.log("error", err);
      callback(
        { error: "Oops, Something went wrong (#EAKFAC1)", code: 500 },
        null
      );
    });
};

module.exports.findOneApiKeyByQuery = function (query, callback) {
  ApiKeys.findOne(query)
    .then(function (repo) {
      if (repo) {
        callback(null, repo);
      } else {
        callback({ error: "ApiKey not found in the system.", code: 404 }, repo);
      }
      return null;
    })
    .catch(function (err) {
      console.log("error", err);
      callback(
        { error: "Oops, Something went wrong (#QEAKFOC1)", code: 500 },
        null
      );
    });
};

module.exports.findAllApiKeysByQuery = function (query, callback) {
  ApiKeys.findAll(query)
    .then(function (rows) {
      if (rows.length > 0) {
        callback(null, rows);
      } else {
        callback({ error: "ApiKeys Not found", code: 404 }, rows);
      }
      return null;
    })
    .catch(function (err) {
      console.log("error", err);
      callback(
        { error: "Oops, Something went wrong (#QEAKFAC1)", code: 500 },
        null
      );
    });
};
