var express = require('express')
var app = express();
var db = require('./Database/db')
var path = require('path')
var router = require('./Router/index')


app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug')
app.use(express.static(path.join(__dirname,'public')))

app.get('/', router)
app.get('/index', router)
app.get('/bicycleDetail', router)


app.listen('5000',function(err){
    if(err) throw err

    console.log('Server started at port 5000')
    console.log('You can access the webpage using http://localhost:5000')
})