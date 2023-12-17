/*
 *
 *  This is main server configuration file
 *
 */

var express = require('express'); // Express.js is a Nodejs Frame work used for web services
var path = require('path'); //The path module provides utilities for working with file and directory paths
var fs = require('fs'); //This module is used to handle file system methods
var bodyParser = require('body-parser'); //Parse incoming request bodies in a middleware before your handlers
var multer = require('multer'); //Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
var compress = require('compression'); //The middleware will attempt to compress response bodies for all request that traverse through the middleware, based on the given options
var cors = require('cors')
var helmet = require('helmet'); //Helmet helps you secure your Express apps by setting various HTTP headers
var db = require('./config/db'); // Including database configuration

var winston = require('winston'); //A multi-transport async logging library for node.js.
var morgan = require('morgan'); //HTTP request logger middleware for node.js

var Config = require('./config/config');  // Including configuration file from config directory. Configuration file included depends on which NODE_ENV application is running on
var port = Config.port; // Getting port on which application will run, depending on the apllication environment
var app = express(); // Initializing express

app.disable('x-powered-by');
app.disable('server');

// app.use(multer());
app.use(helmet());

const corsOptions = {
  origin: 'https://loan-lead-management.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// app.use(require('method-override')('_method')); //Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
var parseForm = bodyParser.urlencoded({ extended: true, limit: '50mb' });

//  Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));  // Enabling url encodeing
app.use(bodyParser.json({ type: 'application/json', limit: '50mb' })); // validating type and size of req.body

// compress
app.use(compress({
    threshold: 512
}));

// increase the timeout to 10 minutes
app.use((req, res, next) => {
    console.log('Setting up the socket timeout to 10 minutes.');
    req.socket.setTimeout(600000);
    next();
});


// dynamically include Controller
// read all files in the controllers directory with .js extensions
// and for each file add them to route
fs.readdirSync('./controllers').forEach(function (file) {
    if (file.substr(-3) == '.js') {
        var route = require('./controllers/' + file);
        route.controller(app);
    }
});


// Sync the database
(async () => {
    try {
      await db.sync();
      console.log('All models were synchronized successfully.');
  
      // After synchronization, the new table should be created in the database
    } catch (error) {
      console.error('Error synchronizing models:', error);
    }
  })();

var server = app.listen(port);

server.timeout = 600000;
console.log('server started on port ' + port);


module.exports = server;
