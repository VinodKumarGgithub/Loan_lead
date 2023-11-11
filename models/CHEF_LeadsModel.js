const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import your Sequelize instance

const Lead = sequelize.define('chef_leads', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  loan_amount: {
    type: DataTypes.STRING
  },
  loan_type:{
    type: DataTypes.STRING
  },
  emp_id: {
    type: DataTypes.INTEGER
  },
  isAssigned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  }
});

module.exports = Lead;


module.exports.findOneIDbyID = function (id, callback) {
    Lead.findOne({
        where: {id: id}
    }).then(function (repo) {
        if (repo) {
            callback(null, repo);
        }
        else {
            callback({error: 'Lead Not found', code: 404}, repo);
        }
        return null;
    }).catch(function (err) {
        console.log('error', err);
        callback({error: 'Oops, Something went wrong (#EAKFOC1)', code: 500}, null);
    });

};

module.exports.findAllLeadByEmpId = function (emp_id, callback) {
    Lead.findAll({
        where: {emp_id: emp_id},
        // order: [['updatedOn', 'DESC']]
    }).then(function (rows) {
        if (rows.length > 0) {
            callback(null, rows);
        }
        else {
            callback({error: 'Lead Not found', code: 404}, rows);
        }
        return null;
    }).catch(function (err) {
        console.log('error', err);
        callback({error: 'Oops, Something went wrong (#EAKFAC1)', code: 500}, null);
    });

};

module.exports.findOneLeadsByQuery = function (query, callback) {
    Lead.findOne(query).then(function (repo) {
        if (repo) {
            callback(null, repo);
        }
        else {
            callback({error: 'Lead not found in the system.', code: 404}, repo);
        }
        return null;
    }).catch(function (err) {
        console.log('error', err);
        callback({error: 'Oops, Something went wrong (#QEAKFOC1)', code: 500}, null);
    });
};

module.exports.findAllLeadByQuery = function (query, callback) {
    Lead.findAll(query).then(function (rows) {
        if (rows.length > 0) {
            callback(null, rows);
        }
        else {
            callback({error: 'Lead Not found', code: 404}, rows);
        }
        return null;
    }).catch(function (err) {
        console.log('error', err);
        callback({error: 'Oops, Something went wrong (#QEAKFAC1)', code: 500}, null);
    });

};


