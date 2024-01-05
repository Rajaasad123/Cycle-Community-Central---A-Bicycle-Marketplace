// Import the 'express' module and assign it to the variable 'express'
var express = require('express')

// Create an instance of the express application
var app = express();

// Import the 'db' module from the './Database/' directory and assign it to the variable 'db'
var db = require('./Database/db')

// Import the 'path' module and assign it to the variable 'path'
var path = require('path')

// Import the 'index' module from the './Router/' directory and assign it to the variable 'router'
var router = require('./Router/index')

// Set the 'views' directory for templates to './views'
app.set('views', path.join(__dirname, 'views'))

// Set the view engine to 'pug'
app.set('view engine', 'pug')

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')))

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Define routes for various paths and associate them with the 'router' module
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

// Start the server on port 5000 and handle errors
app.listen('5000', function (err) {
    if (err) throw err

    console.log('Server started at port 5000')
    console.log('You can access the webpage using http://localhost:5000')
})