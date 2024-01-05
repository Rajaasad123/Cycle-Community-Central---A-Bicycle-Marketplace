var express = require('express')
var app = express();
var db = require('./Database/db')
var path = require('path')
var router = require('./Router/index')


app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug')
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({ extended: true }));

app.get('/', router)
app.get('/index', router)
app.get('/bicycleDetail', router)
app.get('/register', router)
app.post('/register', router)
app.get('/login', router)
app.post('/login', router)
app.get('/profile', router)
app.post('/profile', router)
app.get('/addnewbicycle', router)
app.post('/addnewbicycle', router)
app.get('/logout', router)
app.get('/deletebycycle', router)

app.listen('5000',function(err){
    if(err) throw err

    console.log('Server started at port 5000')
    console.log('You can access the webpage using http://localhost:5000')
})