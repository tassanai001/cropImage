let mongoose = require('mongoose');
let winston = require('winston');
let mysql = require('mysql');
let serialNumber = require('serial-number');

let configMongo = {
    host: 'localhost',
    port: '27017',
    db: 'sample'
};
let mongoOptions = {
    server: { poolSize: 10 }
    //replset: { rs_name: 'foo' }
};


let configMySQL = {
    connectionLimit: 20,
    host: '192.168.1.99',
    user: 'tonman',
    password: 'tbdadmin',
    database: 'erp'
};

let singleton = function singleton() {
    let logger = new (winston.Logger)({
        transports: [
            new winston.transports.File({
                level: 'error',
                filename: './logs/error.json',
                handleExceptions: true,
                json: true,
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: false
            }),
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
    });
    this.logger = logger;

    //=============== Mongo DB Connection ============
    let uri = 'mongodb://' + configMongo.host + ':' + configMongo.port + '/' + configMongo.db;
    let db = mongoose.createConnection(uri, mongoOptions);
    db.on('open', function callback() {
        logger.info("getMongoCon connected successfully");
    });
    db.on('error', function (err) {
        logger.error("DBERROR:" + err);
    });
    this.getMongoCon = function (cb) {
        cb(db);
    };

    //=============== MySQL Connection ============
    let poolMySQL = mysql.createPool(configMySQL);
    this.getConnectionMySQL = function (cb) {
        cb(poolMySQL);
    }
};

singleton.instance = null;
singleton.getInstance = function () {
    if (this.instance === null) {
        this.instance = new singleton();
    }
    return this.instance;
};

module.exports = singleton.getInstance();