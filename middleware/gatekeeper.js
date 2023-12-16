/**
 * Modals Start
 */
var CHEF_ApiKeyModel = require("../models/CHEF_ApiKeyModel");
var Chef_admin = require("../models/CHEF_AdminModel.js");
let Chef_user = require("../models/CHEF_ApiKeyModel.js")

/**
 * Core helping Modules
 */
var crypto = require("crypto"); // Crypto is used for implementing hashing and encrypting algorithms
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const secretKey = process.env.SECRET_KEY_ENV || "3e$9LpQ@2zUxR#7sG*vA!5hT&8nY1mXo";
/**
 * NPM Modules
 */
var auth = require("basic-auth"); //Generic basic auth Authorization header field parser
var async = require("async"); // Async is a module which is used for callback handling of Nodejs functions. we can use async to run respective functions parallel or in series

/**
 * Utilities
 */

var config = require("../config/config.js"); // Including configuration file from config directory. Configuration file included depends on which NODE_ENV application is running on

module.exports.authenticateUser = (req, res, next) => {
  console.log(
    "info",
    "Entering enterprise Gate and validating basic authorization"
  );

  if (auth(req)) {
    let creds = auth(req);
    console.log("info", "Checking either username provided or not", creds);

    let adminid = creds.name;
    let user = adminid.includes("@");
    let pass = creds.pass;
    let userType = user ? "USER" : "ADMIN";
    req.role = userType;

    // if normal user
    if (user) {
      async.series(
        [
          (LoginCallback) => {
            console.log("info", "Validating login request");
            if (!adminid) {
              console.log("error", "Invalid adminid");
              LoginCallback({
                error: "Invalid adminid",
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
                    // res.status(200).send(`Normal user Login Succefull`)
                  } else {
                    res.setHeader("Response-Description", err.error);
                    res.statusCode = err.code;
                    res.end();
                  }
                }
              );
            }
            LoginCallback();
          },
        ],
        (err) => {
          if (err) {
            console.log("error", err);
            res.setHeader("Response-Description", err.error);
            res.statusCode = err.code;
            res.end();
          } else {
            next();
            // res.statusCode = 200;
            // res.send(`${userType} Login Succefull`)
          }
        }
      );
    } else {
      async.series(
        [
          (LoginCallback) => {
            console.log("info", "Validating login request");
            if (!adminid) {
              console.log("error", "Invalid adminid");
              LoginCallback({
                error: "Invalid adminid",
                code: 400,
              });
            } else if (!pass) {
              console.log("error", "Invalid Password");
              LoginCallback({
                error: "Invalid Password",
                code: 400,
              });
            } else {
              Chef_admin.findOneApiKeyByQuery(
                {
                  where: {
                    adminid: adminid,
                    apikey: pass,
                  },
                },
                (err, repo) => {
                  if (!err) {
                    // res.status(200).json(`Admin Login Succefull`)
                  } else {
                    LoginCallback({
                      error: err.error,
                      code: err.code,
                    });
                  }
                }
              );
            }
            LoginCallback();
          },
        ],
        (err) => {
          if (err) {
            console.log("error", err);
            res.setHeader("Response-Description", err.error);
            res.statusCode = err.code;
            res.end();
          } else {
            next();
          }
        }
      );
    }
  } else {
    console.log("error", "Kindly provide the authorization.");
    res.setHeader("Response-Description", "Kindly provide the authorization.");
    res.statusCode = 401;
    res.end();
  }
};

module.exports.token = (req, res, next) => {
  const adminid = req.body.adminid;
  const currentTime = moment().tz("Asia/Kolkata");

  // if (!adminid.includes('@')) {
    if (true) {
    let expiresIn = '7h'; // Set expiration to 7 hours for non-email admin IDs
    generateToken(expiresIn, req, res, next);
  } else if (isWithinTimeRange(currentTime)) {
    let expiresIn = '1h'; // Default expiration is 1 hour
    const endTime = moment().tz('Asia/Kolkata').hour(17).minute(0).second(0);
    if (currentTime.isAfter(endTime)) {
      expiresIn = moment(endTime).diff(currentTime, 'seconds') + 's';
    }
    generateToken(expiresIn, req, res, next);
  } else {
    const error =
      'Token generation is allowed only between 10 am to 5 pm IST';
    console.log('error', error);
    return res.status(403).json({ error: error });
  }
};

function isWithinTimeRange(currentTime) {
  const startTime = moment().tz('Asia/Kolkata').hour(10).minute(0).second(0);
  const endTime = moment().tz('Asia/Kolkata').hour(17).minute(0).second(0);
  return currentTime.isBetween(startTime, endTime);
}

function generateToken(expiresIn, req, res, next) {
  jwt.sign(
    { adminid: req.body.adminid },
    secretKey,
    { expiresIn: expiresIn },
    (err, token) => {
      if (err) {
        console.log('error', err);
        return res.status(500).json({ error: 'Failed to generate token' });
      } else {
        req.token = token;
        console.log('info', 'token : ' + req.token);
        return next();
      }
    }
  );
}


module.exports.verifyToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token not provided" });
  }
  console.log("verifyToken", req.headers.authorization);
  jwt.verify(token, secretKey, async(err, decoded) => {
    if (err) {
      console.log("error", err);
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    // If token is valid, save the decoded information to the request object for use in other routes
    req.decoded = decoded.adminid;
    console.log('info',decoded.adminid);
    if(req.decoded.includes("@")){
      let userRepo= await Chef_user.findOne({where:{adminid: req.decoded}});
      req.query.empid = userRepo.id
    } 

    next();
  });
};

module.exports.hashpassword = (req,res,next) => {
  let password = req.body.password;
  bcrypt.hash(password, saltRounds, function(err, hash) {
    req.body.password = hash;
    req.body.apikey = hash;
    console.log('info',`hashed password`+ hash)
    next()
});
}

module.exports.comparehash =async (pass,hash) => {
  try {
    const result = await bcrypt.compare(pass, hash);
    console.log('compare', result);
    return result;
  } catch (error) {
    console.error('Error comparing hash:', error);
    return result;
  }
}

module.exports.isAdminCheck = (req, res, next) => {
if(req?.decoded?.includes('@') || !req.decoded){
  return res.status(403).send({message:'Authorization forbidden'});
}else{
  console.log('info','Admin ')
  next();
}
}
