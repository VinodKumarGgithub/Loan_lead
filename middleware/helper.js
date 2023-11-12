
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
  let duplicateEntry = []
  try {
    // Start a transaction to ensure atomicity

    await db.transaction(async (t) => {
    
        // Step 2: Fetch leads from CHEF_Leads where isAssigned is 0
        const leadsToUpdate = await CHEF_Leads.findAll({
          where: {
            id: leads,
            [db.Sequelize.Op.or]: [
              { isAssigned: 0 }, // Update leads with isAssigned = 0
              { isAssigned: { [db.Sequelize.Op.eq]: null } }, // Update leads with isAssigned = null
              {
                isAssigned: 1,
                emp_id: { [db.Sequelize.Op.ne]: empid } // Exclude leads with isAssigned = 1 and the same emp_id
              }
            ]
          },
          transaction: t,
        });

        // Step 3: Update isAssigned to 1 for the fetched leads
        const updatedLeads = await CHEF_Leads.update(
          { isAssigned: 1,emp_id: empid },
          {
            where: {
              id: leads,
            },
            transaction: t,
          }
        );
    
        // Step 4: Create lead logs for the updated leads
        const leadLogs = leadsToUpdate.map((lead) => {
          leads.includes(lead.id) === false ? duplicateEntry.push(lead.id) : null;
          return {
            lead_id: lead.id,
            emp_id: empid,
            isAssigned: 1,
            remarks: '', // Add remarks as needed
            loan_amount: lead.loan_amount,
            loan_type: lead.loan_type,
          };
        });

        let status = leadsToUpdate.length === leads.length ? "SuccessFull" : leadsToUpdate.length === 0 ? "Failed" : "Partially Updated"
    req.result = {
      status: status,
      already_Assigned: leadsToUpdate.length === 0 ? leads : duplicateEntry,
      leads_updated: updatedLeads[0]
    }
    
        // Step 5: Bulk insert in the lead_logs table
        await leads_logs.bulkCreate(leadLogs, { transaction: t });

      });
    

    console.log("info", "Leads and lead logs saved successfully");
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.log("error", "Error saving leads and lead logs: ", error);
    res.status(500).send("Error saving leads and lead logs");
  }
};

