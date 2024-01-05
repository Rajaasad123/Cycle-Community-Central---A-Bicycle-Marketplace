var express = require('express')
var mysql = require('mysql')
var router = express.Router()


var mysqlHost = process.env.MYSQL_HOST || 'localhost';
var mysqlPort = process.env.MYSQL_PORT || '3306';
var mysqlUser = process.env.MYSQL_USER || 'root';
var mysqlPass = process.env.MYSQL_PASS || '';
var mysqlDB   = process.env.MYSQL_DB   || 'bycyclecommunity';

var db = mysql.createConnection({
    host: mysqlHost,
    user: mysqlUser,
    password: mysqlPass,
    port: mysqlPort,
    database: mysqlDB
})

db.connect(function(err){
    // console.log("Database",db);
    if(err) throw err

    console.log('Database connected!')
})

module.exports = db