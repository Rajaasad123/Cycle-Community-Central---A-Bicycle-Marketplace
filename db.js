var express = require('express')
var mysql = require('mysql')
var router = express.Router()

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database:'bycyclecommunity'
})

db.connect(function(err){
    if(err) throw err

    console.log('Database connected!')
})

module.exports = db