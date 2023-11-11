var Sequelize = require("sequelize");
var db = require("../config/db"); // Import your Sequelize instance

const Leads = db.define('Lead_Logs', {
  lead_id: {
    type: Sequelize.INTEGER,
  },
  emp_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  loan_amount: {
    type: Sequelize.STRING
  },
  loan_type:{
    type: Sequelize.STRING
  },
  isAssigned: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  remarks: {
    type: Sequelize.STRING,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    onUpdate: Sequelize.NOW
  }
}, {
  // Other model options if needed
});

module.exports = Leads;


module.exports.findOneIDbyID = function (id, callback) {
    Leads.findOne({
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
    Leads.findAll({
        where: {emp_id: emp_id},
        order: [['updatedOn', 'DESC']]
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
    Leads.findOne(query).then(function (repo) {
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
    Leads.findAll().then(function (rows) {
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


