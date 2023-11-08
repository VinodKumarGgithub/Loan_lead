/**
 * Core helping Modules
 */
const crypto = require("crypto"); // Crypto is used for implementing hashing and encrypting algorithms

const config = require("../config/config"); // Including configuration file from config directory. Configuration file included depends on which NODE_ENV application is running on
const async = require("async"); // Async is a module which is used for callback handling of Nodejs functions. we can use async to run respective functions parallel or in series
// const LoginSessions = require('../models/CHEF_LoginSessionsModel');
var utils = require("../Utilities/utils"); // Including utils.js file from utillities directory. utils.js include various helper functions such as formating date etc
var XLSX = require("xlsx"); //This module is used to parser and writer for various spreadsheet formats.
var multer = require("multer");
const upload = multer({ dest: "uploads/" });

const gatekeeper = require("../middleware/gatekeeper");
const Chef_user = require("../models/CHEF_ApiKeyModel");
const Chef_admin = require("../models/CHEF_AdminModel");
const CHEF_Leads = require("../models/CHEF_LeadsModel");
module.exports.controller = (app) => {
  app.post("/api/payers/login", gatekeeper.token, (req, res) => {
    let admin = req.body.adminid;
    let user = admin.includes("@");

    let userType = user ? "USER" : "ADMIN";

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
              Chef_user.findOneAdminIdByAdminId(adminid,
                async (err, repo) => {
                  if (!err) {
                    let comparepass;
                    try {
                      comparepass = await gatekeeper.comparehash(pass, repo.password);
                      console.log('res', comparepass);
                      if (!comparepass) {
                       return LoginCallback({
                          error: "Invalid password",
                          code: 401,

                        });
                      } else {
                        console.log('info', 'password verified:', comparepass);
                       return LoginCallback();
                      }
                    } catch (err) {
                      console.log('error', err);
                    }
                  } else {
                    res.setHeader("Response-Description", err.error);
                    res.status(err.code).end();
                  }
                  LoginCallback();
                }
              );
            }
          },
        ],
        (err) => {
          if (err) {
            res.setHeader("Response-Description", err.error);
            res.status(err.code).end();
          } else {
            res.status(200).send({ "jwt" : `${req.token}`});
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
              Chef_admin.findOneAdminIdByAdminId( adminid,
              async  (err, repo) => {
                  if (!err) {
                    console.log(pass,repo.password);
                    let comparepass;
                    try {
                      comparepass = await gatekeeper.comparehash(pass, repo.password);
                      console.log('res', comparepass);
                      if (!comparepass) {
                        return LoginCallback({
                          error: "Invalid password",
                          code: 401,
                        });
                      } else {
                        console.log('info', 'password verified:', comparepass);
                        return LoginCallback();
                      }
                    } catch (err) {
                      console.log('error', err);
                    }
                    
                  } else {
                    res.setHeader("Response-Description", err.error);
                    res.status(err.code).end();
                  }
                  LoginCallback();
                }
              );
            }
          },
        ],
        (err) => {
          if (err) {
            console.log("error", err);
            res.setHeader("Response-Description", err.error);
            res.status(err.code).end();
          } else {
            res.status(200).send(`Admin #2, jwt : ${req.token}`);
          }
        }
      );
    }
  });

  app.post("/api/payers/create-user",
  gatekeeper.verifyToken,
  gatekeeper.isAdminCheck,
   gatekeeper.hashpassword, (req, res) => {
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
                  adminid: adminid,
                  password: pass,
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
                        username: req.body.adminid,
                        password: req.body.password,
                      });
                      res.end();
                    })
                    .catch((error) => {
                      console.error("User already created #2",error);
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
  });

  app.post("/leads/imports",
    gatekeeper.verifyToken,
    gatekeeper.isAdminCheck,
    upload.single("file"),
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

          var formatArray = ["NAME", "PHONE_NUMBER", "GENDER"];

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
              LeadsList.push(newLead);
            }
            console.log("info", "Saving leads from file");
            CHEF_Leads.bulkCreate(LeadsList)
              .then(() => {
                console.log("info", "Leads saved successfully");
                res.status(200).send("Leads saved successfully");
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
          res
            .status(400)
            .send("errors: Uploaded file is corrupt, please fix and try again");
        }
      }
    }
  );

  app.get("/leads", gatekeeper.verifyToken, (req, res) => {
    CHEF_Leads.findAllLeadByQuery({},(err, result) => {
      if (!err) {
        res.status(200).send(result);
        console.log("info", "leads got successfully");
      } else {
        res.status(404).send(err);
        console.log("error", err);
      }
    });
  });

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

  app.get("/leads/emp/:empid", gatekeeper.verifyToken, (req, res) => {
    let id = req.params.empid;
    CHEF_Leads.findAllLeadByEmpId({
      where :{
        emp_id : id
      }
    }, (err, result) => {
      if (!err) {
        console.log("info", "leads got successfully");
        return res.status(200).send(result);
      } else {
        // setHeaders({'Response-Description':err.error})
        res.status(err.code).send(err.error);
        console.log("error", err);
      }
    });
  });
};
