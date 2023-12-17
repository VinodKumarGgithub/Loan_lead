/**
 * Created by Vinod 
 */


var Sequelize = require('sequelize');
var db = require('../config/db');

var Admin = db.define('CHEF_Admins',
 {

    adminid: {
        type: Sequelize.STRING(500),
        unique: 'compositeIndex',
        primaryKey: true
    },
    //Enterprise admin id
    apikey: {type: Sequelize.STRING},
    password: {type: Sequelize.STRING},

    //Enterprise which has generated the keys
    type: {type: Sequelize.STRING},
    // * App Details
    appname: {type: Sequelize.STRING},
    apptype: {type: Sequelize.STRING},
    publicurl: {type: Sequelize.STRING},
    // * Contact Info
    contactname: {type: Sequelize.STRING},
    contactemail: {type: Sequelize.STRING},
    contactmobileno: {type: Sequelize.STRING},
    //validatereqeuest as YES
    secretkey: {type: Sequelize.STRING},
    // inhouseapp filed value being "YES" AND ALSO  environment filed value to be "PRODUCTION"
    inhouseapp: {type: Sequelize.STRING, defaultValue: 'NO'},
    //Date and time on which the was generated
    createdOn: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedOn: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },

    createdOn_str: {
        type: Sequelize.STRING
    },
    updatedOn_str: {
        type: Sequelize.STRING
    },
    // New
    status: {type: Sequelize.STRING, defaultValue: 'ACTIVE'},
    //System or user who has generated this key
    //If Mangaer has approved the key to live from test mode
    //then the manager user id is stored in the field
    createdBy: {type: Sequelize.STRING},
    updatedBy: {type: Sequelize.STRING},
    approvedrejectedby: {type: Sequelize.STRING},
    createdOnLocal: {type: Sequelize.DATE},
    createdOnLocal_str: {
        type: Sequelize.STRING
    },
    updatedOnLocal: {type: Sequelize.DATE},
    updatedOnLocal_str: {
        type: Sequelize.STRING
    }

},
{
  indexes: [
    {
      unique: true,
      fields: ['adminid','password']
    }
  ]
});

module.exports = Admin;

module.exports.findOneAdminIdByAdminId = function (adminid, callback) {
    Admin.findOne({
        where: {adminid: adminid}
    }).then(function (repo) {
        if (repo) {
            callback(null, repo);
        }
        else {
            callback({error: 'Admin Not found', code: 200}, repo);
        }
        return null;
    }).catch(function (err) {
        console.log('error', err);
        callback({error: 'Oops, Something went wrong (#EAKFOC1)', code: 500}, null);
    });

};

module.exports.findAllAdminByEnterpriseId = function (enterpriseid, callback) {
    Admin.findAll({
        where: {enterpriseid: enterpriseid},
        order: [['updatedOn', 'DESC']]
    }).then(function (rows) {
        if (rows.length > 0) {
            callback(null, rows);
        }
        else {
            callback({error: 'Admin Not found', code: 200}, rows);
        }
        return null;
    }).catch(function (err) {
        console.log('error', err);
        callback({error: 'Oops, Something went wrong (#EAKFAC1)', code: 500}, null);
    });

};

module.exports.findOneApiKeyByQuery = function (query, callback) {
    Admin.findOne(query).then(function (repo) {
        if (repo) {
            callback(null, repo);
        }
        else {
            callback({error: 'Admin not found in the system.', code: 200}, repo);
        }
        return null;
    }).catch(function (err) {
        console.log('error', err);
        callback({error: 'Oops, Something went wrong (#QEAKFOC1)', code: 500}, null);
    });
};

module.exports.findAllAdminByQuery = function (query, callback) {
    Admin.findAll(query).then(function (rows) {
        if (rows.length > 0) {
            callback(null, rows);
        }
        else {
            callback({error: 'Admin Not found', code: 200}, rows);
        }
        return null;
    }).catch(function (err) {
        console.log('error', err);
        callback({error: 'Oops, Something went wrong (#QEAKFAC1)', code: 500}, null);
    });

};

