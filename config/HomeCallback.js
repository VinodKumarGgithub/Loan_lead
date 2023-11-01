// /**
//  * Created by Farhan 02/20/17.
//  */



// module.exports.dbCallback = function (callback) {
//     var Sequelize = require('sequelize');
//     var config = require('../config/config');
//     var httpHelper = require('../utilities/HTTPHelpers.js'); // Including the HTTPHelpers.js file placed in utilities directory. HTTPHelpers.js contains all the helper functions created to make HTTP/HTTPS calls

//     var env = process.env.NODE_ENV || 'development';
//     var dbURI = config.dbURI;

//     console.log("Going to connect");
//     console.log("DB uri is " + dbURI);


//     var db = new Sequelize(dbURI, {
//         // disable logging; default: console.log
//         logging: false

//     });

// // test connection
//     db.authenticate()
//         .then(function () {
//             console.log('Connection has been established successfully.');
//             callback(db);
//             return null;
//         })
//         .catch(function (err) {
//             console.log('Unable to connect to the database:', err);
//             callback();
//             return null;
//         });
// };
