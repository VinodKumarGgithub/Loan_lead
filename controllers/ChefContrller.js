

/**
 * Core helping Modules
 */
const crypto = require('crypto'); // Crypto is used for implementing hashing and encrypting algorithms

const config = require('../config/config'); // Including configuration file from config directory. Configuration file included depends on which NODE_ENV application is running on
const async = require('async'); // Async is a module which is used for callback handling of Nodejs functions. we can use async to run respective functions parallel or in series
// const LoginSessions = require('../models/CHEF_LoginSessionsModel');

module.exports.controller = (app) => {

   
    app.post('/api/payers/login', (req, res) => {

        let admin = req.body.username;
        let user = admin.includes("@");

        let userType = user ? "USER" : "ADMIN"    
      
        // if normal user
        if (user) {
            async.series([
                (LoginCallback) => {

                    let adminid = req.body.username;
                    let pass = req.body.password;
                    console.log('info', "Validating login request");
                    if (!adminid) {
                        console.log('error', 'Invalid Username');
                        LoginCallback({
                            error: 'Invalid Username',
                            code: 400
                        });
                    }
                    else if (!pass) {
                        console.log('error', 'Invalid Password');
                        LoginCallback({
                            error: 'Invalid Password',
                            code: 400
                        });
                    }
                    else {
                        adminid = adminid.toLowerCase();

                        console.log('info', "Login request made by: " + adminid);
                     
                    }
                    LoginCallback()
                }
            ], (err) => {
                if (err) {
                    console.log('error', err);
                    res.setHeader("Response-Description", err.error);
                    res.statusCode = err.code;
                    res.end();
                }
                else {
                   
                        res.statusCode = 200;
                        res.send(`${userType} Login Succefull`)
                    
                }
            });
        }
        else {
            async.series([
                (LoginCallback) => {

                    let adminid = req.body.username;
                    let pass = req.body.password;

                    console.log('info', "Validating login request");
                    if (!adminid) {
                        console.log('error', 'Invalid Username');
                        LoginCallback({
                            error: 'Invalid Username',
                            code: 400
                        });
                    }
                    else if (!pass) {
                        console.log('error', 'Invalid Password');
                        LoginCallback({
                            error: 'Invalid Password',
                            code: 400
                        });
                    }
                    else {
                        adminid = adminid.toLowerCase();

                        console.log('info', "Login request made by: " + adminid);
                       
                    }
                    LoginCallback()
                }
            ], (err) => {
                if (err) {
                    console.log('error', err);
                    res.setHeader("Response-Description", err.error);
                    res.statusCode = err.code;
                    res.end();
                }
                else {
                        res.statusCode = 200;
                        res.send(`${userType} Login Succefull`)
                        res.json({
                            apikey: APIKEY,
                            usertype: USERTYPE,
                            appname: LOGINSESSION
                        });
                    
                }
            });
        }
    });

    app.post('/api/payers/signup', (req, res) => {


        let admin = req.body.username;
        let user = admin.includes("@");

    
            async.series([
                (LoginCallback) => {

                    let email = req.body.email;
                    let adminid = req.body.username;
                    let user = adminid.includes("@");
                    let pass = req.body.password;
                    let confirmpass = req.body.confirmpassword;
                    console.log('info', "Validating signup request");
                    if (!user || !adminid) {
                        console.log('error', 'Invalid Username');
                        LoginCallback({
                            error: 'Invalid Username',
                            code: 400
                        });
                    } 
                    else if (!email.includes("@gmail.com")) {
                        console.log('error', 'Invalid Email');
                        LoginCallback({
                            error: 'Invalid Email',
                            code: 400
                        });
                    }
                    else if (!pass || !confirmpass || pass!==confirmpass) {
                        console.log('error', 'Invalid Password');
                        LoginCallback({
                            error: 'Invalid Password',
                            code: 400
                        });
                    }else{
                        console.log('validated successfully ')
                    }
                    LoginCallback()
                }
            ], (err) => {
                if (err) {
                    console.log('error', err);
                    res.setHeader("Response-Description", err.error);
                    res.statusCode = err.code;
                    res.end();
                }
                else {
                   
                        res.statusCode = 200;
                        res.send("User signup Succefull")
                }
            });
        
    });
};