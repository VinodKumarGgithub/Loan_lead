/**
 * Core helping Modules
 */
const crypto = require("crypto"); // Crypto is used for implementing hashing and encrypting algorithms
const fs = require('fs');

const config = require("../config/config"); // Including configuration file from config directory. Configuration file included depends on which NODE_ENV application is running on
const async = require("async"); // Async is a module which is used for callback handling of Nodejs functions. we can use async to run respective functions parallel or in series
// const LoginSessions = require('../models/CHEF_LoginSessionsModel');
var utils = require("../utilities/utils"); // Including utils.js file from utillities directory. utils.js include various helper functions such as formating date etc
var XLSX = require("xlsx"); //This module is used to parser and writer for various spreadsheet formats.
var multer = require("multer");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const upload = multer({ dest: "uploads/" });

const gatekeeper = require("../middleware/gatekeeper");

// database models
const Chef_user = require("../models/CHEF_ApiKeyModel");
const Chef_admin = require("../models/CHEF_AdminModel");
const CHEF_Leads = require("../models/CHEF_LeadsModel");
const leads_logs = require("../models/Lead_LogsModel");
const helper = require("../middleware/helper");
const db = require("../config/db");

module.exports.controller = (app) => {
  app.post("/api/payers/login", gatekeeper.token, (req, res) => {
    let admin = req.body.adminid;
    let user = admin.includes("@");

    let userType = user ? "USER" : "ADMIN";
    let adminid = req.body.adminid;
    let id = "";

    // if normal user
    if (user) {
      async.series(
        [
          (LoginCallback) => {
            let adminid = req.body.adminid;
            let pass = req.body.password;
            console.log("info", "Validating login request");

            if (!adminid) {
              console.log("error", "Invalid adminid");
              return LoginCallback({
                error: "Invalid adminid",
                code: 400,
              });
            } else if (!pass) {
              console.log("error", "Invalid Password");
              return LoginCallback({
                error: "Invalid Password",
                code: 400,
              });
            } else {
              // Your logic here for handling normal users
              Chef_user.findOneAdminIdByAdminId(adminid, async (err, repo) => {
                if (!err) {
                  let comparepass;
                  id = repo.id;
                  try {
                    comparepass = await gatekeeper.comparehash(
                      pass,
                      repo.password
                    );
                    console.log("res", comparepass);
                    if (!comparepass) {
                      return LoginCallback({
                        error: "Invalid password",
                        code: 401,
                      });
                    } else {
                      console.log("info", "password verified:", comparepass);
                      return LoginCallback();
                    }
                  } catch (err) {
                    console.log("error", err);
                  }
                } else {
                  res.setHeader("Response-Description", err.error);
                  res.status(err.code).end();
                }
                LoginCallback();
              });
            }
          },
        ],
        (err) => {
          if (err) {
            res.setHeader("Response-Description", err.error);
            res.status(err.code).end();
          } else {
            res
              .status(200)
              .send({
                message: "user login succesfully",
                jwt: `${req.token}`,
                user: { id, adminid, role: userType },
              });
          }
        }
      );
    } else {
      async.series(
        [
          (LoginCallback) => {
            let adminid = req.body.adminid;
            let pass = req.body.password;
            console.log("info", "Validating admin login request");

            if (!adminid) {
              console.log("error", "Invalid adminid");
              return LoginCallback({
                error: "Invalid adminid",
                code: 400,
              });
            } else if (!pass) {
              console.log("error", "Invalid Password");
              return LoginCallback({
                error: "Invalid Password",
                code: 400,
              });
            } else {
              // Your logic here for handling admins
              Chef_admin.findOneAdminIdByAdminId(adminid, async (err, repo) => {
                if (!err) {
                  console.log(pass, repo.password);
                  let comparepass;
                  id = repo.id;
                  try {
                    comparepass = await gatekeeper.comparehash(
                      pass,
                      repo.password
                    );
                    console.log("res", comparepass);
                    if (!comparepass) {
                      return LoginCallback({
                        error: "Invalid password",
                        code: 401,
                      });
                    } else {
                      console.log("info", "password verified:", comparepass);
                      return LoginCallback();
                    }
                  } catch (err) {
                    console.log("error", err);
                  }
                } else {
                  res.setHeader("Response-Description", err.error);
                  res.status(err.code).end();
                }
                LoginCallback();
              });
            }
          },
        ],
        (err) => {
          if (err) {
            console.log("error", err);
            res.setHeader("Response-Description", err.error);
            res.status(err.code).end();
          } else {
            res
              .status(200)
              .send({
                message: "admin login succesfully",
                jwt: `${req.token}`,
                user: { id, adminid, role: userType },
              });
          }
        }
      );
    }
  });

  app.post(
    "/api/payers/create-user",
    gatekeeper.verifyToken,
    gatekeeper.isAdminCheck,
    gatekeeper.hashpassword,
    (req, res) => {
      let admin = req.body.adminid;
      let user = admin.includes("@");

      async.series(
        [
          (LoginCallback) => {
            let email = req.body.email;
            let adminid = req.body.adminid;
            let user = adminid.includes("@");
            let pass = req.body.password;

            console.log("info", "Validating user request");
            if (!user || !adminid) {
              console.log("error", "Invalid adminid");
              LoginCallback({
                error: "Invalid adminid",
                code: 400,
              });
            } else if (!email.includes("@gmail.com")) {
              console.log("error", "Invalid Email");
              LoginCallback({
                error: "Invalid Email",
                code: 400,
              });
            } else if (!pass) {
              console.log("error", "Invalid Password");
              LoginCallback({
                error: "Invalid Password",
                code: 400,
              });
            } else {
              Chef_user.findOneApiKeyByQuery(
                {
                  where: {
                    [Op.or]: [
                      { adminid: adminid },
                      { email: email },
                    ],
                  },
                },
                (err, repo) => {
                  if (!err) {
                    let err = {
                      code: 409,
                      error: "User already created #1",
                    };

                    LoginCallback(err);
                    console.log("User already created #1");
                  } else {
                    Chef_user.create(req.body)
                      .then((user) => {
                        console.log("User created Succefully");
                        res.status(201).json({
                          message: "User created Succefully",
                        });
                        res.end();
                      })
                      .catch((error) => {
                        console.error("User already created #2", error);
                        error.code = 409;
                        error.error = "User already created #2";
                        LoginCallback(error);
                      });
                  }
                }
              );
            }
          },
        ],
        (err) => {
          if (err) {
            // console.log('error', err);
            res.setHeader("Response-Description", err?.error);
            res.statusCode = err.code;
            res.end();
          } else {
            res.status(201).json({
              message: "User created Succefully",
              username: req.body.adminid,
              password: req.body.password,
            });
          }
        }
      );
    }
  );
  // upload multiple lead with the help of excel
  app.post(
    "/leads/imports",
    upload.single("file"),
    gatekeeper.verifyToken,
    gatekeeper.isAdminCheck,
    (req, res, next) => {
      console.log("info", "authenticated entered main code", req.file);

      if (!req.file) {
        console.log("error", "Invalid File");
        res.status(400).send("Invalid File");
      } else {
        // return res.status(200).send("File successfully uploaded");
        try {
          var workbook = XLSX.readFile(req.file.path);
          // Read fist sheet
          var first_sheet_name = workbook.SheetNames[0];
          // Get worksheet
          var worksheet = workbook.Sheets[first_sheet_name];
          var data = XLSX.utils.sheet_to_json(worksheet);

          var formatArray = [
            "NAME",
            "PHONE_NUMBER",
            "GENDER",
            "EMPLOYEE_ID",
            "LOAN_AMOUNT",
            "LOAN_TYPE",
          ];

          var headers = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          })[0];

          var is_same =
            headers.length === formatArray.length &&
            headers.every(function (element, index) {
              return element === formatArray[index];
            });

          if (is_same) {
            console.log("info", "file verifired successfully");
            let LeadsList = [];
            console.log("workbook", data);

            for (var index = 0; index < data.length; index++) {
              var newLead = {};
              newLead.index = index + 1;
              newLead.name = data[index]["NAME"] ? data[index]["NAME"] : "";
              newLead.phone_number = data[index]["PHONE_NUMBER"]
                ? data[index]["PHONE_NUMBER"]
                : "";
              newLead.gender = data[index]["GENDER"]
                ? data[index]["GENDER"]
                : "";
              newLead.emp_id = data[index]["EMPLOYEE_ID"]
                ? data[index]["EMPLOYEE_ID"]
                : "";
              newLead.loan_amount = data[index]["LOAN_AMOUNT"]
                ? data[index]["LOAN_AMOUNT"]
                : "";
              newLead.loan_type = data[index]["LOAN_TYPE"]
                ? data[index]["LOAN_TYPE"]
                : "";
              LeadsList.push(newLead);
            }
            console.log("info", "Saving leads from file");

            CHEF_Leads.bulkCreate(LeadsList, {
              ignoreDuplicates: true, // This option tells Sequelize to ignore duplicate entries
            })
              .then((result) => {
                const newRecordsArray = []
                result.forEach(chefLead => {
                  if(chefLead.isNewRecord ===true ){
                    newRecordsArray.push(newRecordsArray)
                  }
                });
                console.log(newRecordsArray)
                const savedLeadsCount = newRecordsArray.length;
                if (savedLeadsCount > 0) { 
                  console.log(
                    "info",
                    `${savedLeadsCount} leads saved successfully`
                  );
                  fs.unlinkSync(req.file.path);
                  res
                    .status(200)
                    .send(`${savedLeadsCount} leads saved successfully`);
                } else {
                  const errorMessage =
                    "No new leads to save or all leads are duplicates";
                  console.log("info", errorMessage);
                  fs.unlinkSync(req.file.path);
                  res.status(204).send(errorMessage);
                }
              })
              .catch((error) => {
                console.log("error", "Error saving leads: ", error);
                res.status(500).send("Error saving leads");
              });
          } else {
            console.log("error", "Invalid File Format");
            res.status(400).send("errors: Invalid File Format");
          }
        } catch (e) {
          console.log("error", "Something wrong with leads file: ", e);
          fs.unlinkSync(req.file.path);
          res
            .status(400)
            .send("errors: Uploaded file is corrupt, please fix and try again");
        }
      }
    }
  );

  // upload all lead
  app.post(
    "/leads",
    gatekeeper.verifyToken,
    gatekeeper.isAdminCheck,
    async (req, res) => {
      try {
        if (!req.body || !Array.isArray(req.body)) {
          return res.status(400).send("Invalid leads array");
        }

        const invalidLeads = [];
        const validLeads = req.body.filter((lead, index) => {
          const missingFields = [];

          // Define required fields
          const requiredFields = [
            "name",
            "gender",
            "phone_number",
            "loan_amount",
            "loan_type",
            "status",
          ];

          requiredFields.forEach((field) => {
            if (!lead[field]) {
              missingFields.push(field);
            }
          });

          if (missingFields.length > 0) {
            invalidLeads.push({
              index,
              error: `Missing fields: ${missingFields.join(", ")}`,
            });
            return false;
          }

          return true;
        });

        const result = await CHEF_Leads.bulkCreate(validLeads, {
          ignoreDuplicates: true,
        });

        const savedLeadsCount = result.length;

        if (savedLeadsCount > 0) {
          console.log("info", `${savedLeadsCount} leads saved successfully`);
          const response = {
            message: `${savedLeadsCount} leads saved successfully`,
            invalidLeads: invalidLeads,
          };
          res.status(200).json(response);
        } else {
          const errorMessage =
            "No new leads to save or all leads are duplicates";
          console.log("info", errorMessage);
          const response = {
            message: errorMessage,
            invalidLeads: invalidLeads,
          };
          res.status(204).json(response);
        }
      } catch (error) {
        console.log("error", "Error processing leads: ", error);
        res.status(500).send("Error processing leads");
      }
    }
  );

  // update status or remark
  app.put(
    "/leads/:id",
    gatekeeper.verifyToken,
    // gatekeeper.isAdminCheck,
    async (req, res) => {
      try {
        const { id } = req.params;
        const { status, remark } = req.body;

        if (!status && !remark) {
          return res
            .status(400)
            .send("Either status or remark should be provided");
        }

        const lead = await CHEF_Leads.findByPk(id);

        if (!lead) {
          return res.status(404).send("Lead not found");
        }

        // Update the status and/or remark if provided
        if (status !== undefined) {
          lead.status = status;
        }

        if (remark !== undefined) {
          // Explicitly set the 'changed' flag for the 'remark' field
          // lead.setDataValue('remark', lead.getDataValue('remark'));
          lead.changed("remark", true);

          // Assuming remark is an array field in the database
          const existingRemarks = lead.remark || [];

          // Append the new remark to the array
          existingRemarks.push({
            message: remark,
            time: moment().tz("Asia/Kolkata").format(),
          });

          lead.remark = existingRemarks;
        }

        await lead.save();

        console.log("info", "Lead updated successfully");
        res.status(200).send("Lead updated successfully");
      } catch (error) {
        console.log("error", "Error updating lead: ", error);
        res.status(500).send("Error updating lead");
      }
    }
  );

  app.get(
    "/leads",
    gatekeeper.verifyToken,
    gatekeeper.isAdminCheck,
    (req, res) => {
      CHEF_Leads.findAllLeadByQuery({}, (err, result) => {
        if (!err) {
          res.status(200).send(result);
          console.log("info", "leads got successfully");
        } else {
          res.status(404).send(err);
          console.log("error", err);
        }
      });
    }
  );

  app.get("/leads/:id", gatekeeper.verifyToken, (req, res) => {
    let id = req.params.id;
    CHEF_Leads.findOneIDbyID(id, (err, result) => {
      if (!err) {
        res.status(200).send(result);
        console.log("info", "leads got successfully");
      } else {
        res.status(404).send(err);
        console.log("error", err);
      }
    });
  });

  // get a single employee
  app.get("/emp", gatekeeper.verifyToken, async (req, res) => {
    try {
      const id = req.query.empid;
      console.log("id :", req.body);
      const employee = await Chef_user.findByPk(id);

      if (employee) {
        console.log("info", "Employee retrieved successfully");
        res.status(200).send(employee.toJSON());
      } else {
        console.log("info", "Employee not found");
        res.status(404).send("Employee not found");
      }
    } catch (error) {
      console.log("error", "Error fetching employee: ", error);
      res.status(500).send("Error fetching employee");
    }
  });

  // get a employee-list
  app.get(
    "/all-employees",
    gatekeeper.verifyToken,
    gatekeeper.isAdminCheck,
    async (req, res) => {
      let keyword = req.query.query || "";
      try {
        const employees = await Chef_user.findAll({
          where: {
            [Op.or]: [
              { id: { [Op.like]: "%" + keyword + "%" } },
              { email: { [Op.like]: "%" + keyword + "%" } },
              { adminid: { [Op.like]: "%" + keyword + "%" } },
            ],
          },
        });

        if (employees) {
          console.log("info", "Employees retrieved successfully");
          console.log(employees);
          res.status(200).send(employees);
        } else {
          console.log("info", "Employees not found");
          res.status(404).send("Employees not found");
        }
      } catch (error) {
        console.log("error", "Error fetching employees: ", error);
        res.status(500).send("Error fetching employees");
      }
    }
  );

  app.get("/leads/emp/:empid", gatekeeper.verifyToken, (req, res) => {
    let id = req.params.empid;
    console.log("info", id);
    CHEF_Leads.findAllLeadByQuery(
      {
        where: {
          emp_id: id,
        },
      },
      (err, result) => {
        if (!err) {
          console.log("info", "leads got successfully");
          return res.status(200).send(result);
        } else {
          // setHeaders({'Response-Description':err.error})
          res.status(err.code).send(err.error);
          console.log("error", err);
        }
      }
    );
  });

  app.post(
    "/leads/emp/:empid",
    gatekeeper.verifyToken,
    gatekeeper.isAdminCheck,
    utils.addEmpIdMiddleware,
    helper.saveLeadsAndLogsMiddleware,
    (req, res) => {
      res
        .status(200)
        .send(req?.result || "Leads and lead logs saved successfully");
    }
  );
};
