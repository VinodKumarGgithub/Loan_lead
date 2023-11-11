
const Sequelize = require('sequelize');
// database models
const Chef_user = require("../models/CHEF_ApiKeyModel");
const Chef_admin = require("../models/CHEF_AdminModel");
const CHEF_Leads = require("../models/CHEF_LeadsModel");
const leads_logs = require("../models/Lead_LogsModel");
const db = require("../config/db")

module.exports.saveLeadsAndLogsMiddleware = async (req, res, next) => {
  const { leads } = req.body;
  const empid = req.params.empid || req.body.empid;

  try {
    // Start a transaction to ensure atomicity
    await db.transaction(async (t) => {
      // Step 1: Bulk insert/update in the main table (CHEF_Leads)
      const createdLeads = await CHEF_Leads.bulkCreate(leads, {
        updateOnDuplicate: ['name', 'gender', 'phone_number', 'emp_id', 'isAssigned', 'loan_amount', 'loan_type'],
        transaction: t,
      });

      // Step 2: Create lead logs for each created lead
      const leadLogs = createdLeads.map((lead) => {
        return {
          lead_id: lead.id,
          emp_id: lead.emp_id,
          isAssigned: lead.isAssigned,
          remarks: '', // Add remarks as needed
          loan_amount:lead.loan_amount,
          loan_type:lead.loan_type
        };
      });

      // Bulk insert in the lead_logs table
      await leads_logs.bulkCreate(leadLogs, { transaction: t });
    });

    console.log("info", "Leads and lead logs saved successfully");
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.log("error", "Error saving leads and lead logs: ", error);
    res.status(500).send("Error saving leads and lead logs");
  }
};

