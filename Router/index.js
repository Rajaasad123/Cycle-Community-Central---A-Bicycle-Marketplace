// Import the 'express' module and assign it to the variable 'express'
const express = require('express');

// Import the 'express-session' module and assign it to the variable 'session'
const session = require('express-session');

// Import the 'crypto' module and assign it to the variable 'crypto'
const crypto = require('crypto');

// Import the 'multer' module and assign it to the variable 'multer'
const multer = require('multer');

// Create an instance of multer with memory storage for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Generate a random 32-byte hex key for session encryption
const secretKey = crypto.randomBytes(32).toString('hex');

// Create an instance of the express Router
const router = express.Router();

// Use the express-session middleware with the generated secret key
router.use(session({
  secret: secretKey,
  resave: true,
  saveUninitialized: true
}));

// Import the 'db' module from the '../Database/' directory and assign it to the variable 'db'
var db = require('../Database/db');

// Define a route for the root path ('/') that renders the 'home' template
router.get('/', function(req, res) {
  res.render('home', { user: req.session.user });
});

// Define a route for the '/index' path that fetches data from the database based on filters and renders the 'index' template
router.get('/index', function(req, res) {
  // Extract filters from the query parameters
  const filters = {
      color: req.query.color || [],
      size: req.query.size || [],
      purchaseMode: req.query.purchaseMode || []
  };

  // Extract individual filter arrays
  const colorFilters = req.query.color || [];
  const sizeFilters = req.query.size || [];
  const purchaseModeFilters = req.query.purchaseMode || [];

  // Construct a SQL query based on the filters
  let query = 'SELECT * FROM bicycles WHERE 1';
  for (const filterName in filters) {
      const filterValues = filters[filterName];
      if (filterValues.length > 0) {
          const valuesArray = Array.isArray(filterValues) ? filterValues : [filterValues];
          query += ` AND ${filterName} IN ('${valuesArray.join("','")}')`;
      }
  }

  // Log the generated SQL query
  console.log(query);

  // Execute the query and render the 'index' template with the results
  db.query(query, (error, results, fields) => {
      if (error) throw error;
      res.render('index', {
        data: results,
        colorFilters: colorFilters,
        sizeFilters: sizeFilters,
        purchaseModeFilters: purchaseModeFilters, 
        user: req.session.user,
    });
  });
});

// Define a route for the '/bicycleDetail' path that fetches detailed information about a bicycle and its comments
router.get('/bicycleDetail', function (req, res) {
  // Extract the bicycle ID from the query parameters
  var id = req.query.id;

  // Construct a SQL query to retrieve bicycle details and associated comments
  let query = `
    SELECT bicycles.*, comments.*
    FROM bicycles
    LEFT JOIN comments ON bicycles.Id = comments.bycycleId
    WHERE bicycles.Id = ?
  `;

  // Execute the query with the bicycle ID as a parameter
  db.query(query, [id], (error, results, fields) => {
    if (error) throw error;

    // Check if any results were returned
    if (results.length > 0) {
      // Extract bicycle data from the results
      const bicycleData = {
        Id: results[0].Id,
        Title: results[0].Title,
        Quantity: results[0].Quantity,
        Condition: results[0].Condition,
        Description: results[0].Description,
        Specification: results[0].Specification,
        Price: results[0].Price,
        PurchaseMode: results[0].PurchaseMode,
        Image: results[0].Image
      };

      // Extract comments data from the results
      const commentsData = results
        .filter(comment => comment.Comment !== null)
        .map(comment => ({
          Comment: comment.Comment,
          Datetime: new Date(comment.Datetime).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        }));

      // Render the 'bicycledetail' template with the extracted data
      res.render('bicycledetail', { data: bicycleData, comments: commentsData, user: req.session.user });
    } else {
      // If no bicycle is found with the specified ID, send an error message
      res.send('No bicycle found with the specified ID');
    }
  });
});

// Define a route for the '/register' path that renders the 'register' template
router.get('/register', function(req, res) {
  res.render('register');
});

// Define a route for handling user registration form submissions
router.post('/register', (req, res) => {
  // Extract user registration data from the request body
  const { name, email, password, confirmPassword } = req.body;

  // Check if the entered passwords match
  if (password !== confirmPassword) {
    return res.send('<script>alert("Password does not match"); window.location.href = "/register";</script>');
  }

  // Construct a SQL query to insert the user into the database
  const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  const insertUserValues = [name, email, password];

  // Execute the query to insert the user into the database
  db.query(insertUserQuery, insertUserValues, (error, results, fields) => {
    if (error) {
      console.error('Error inserting user:', error);
      return res.send('Registration failed!');
    }

    // Log success and redirect the user
    console.log('User registered successfully!');
    const script = '<script>alert("Registration successful!"); window.location.href = "/";</script>';
    res.send(script);
  });
});

// Define a route for the '/login' path that renders the 'login' template
router.get('/login', function(req, res) {
  res.render('login');
});

// Define a route for handling user login form submissions
router.post('/login', (req, res) => {
  // Extract user login data from the request body
  const { email, password } = req.body;

  // Construct a SQL query to retrieve the user from the database based on the entered email
  const getUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(getUserQuery, [email], (error, results, fields) => {
    if (error) {
      console.error('Error getting user:', error);
      return res.send('<script>alert("Login Failed"); window.location.href = "/login";</script>');
    }

    // Check if a user with the entered email exists
    if (results.length === 0) {
      return res.send('<script>alert("User not found"); window.location.href = "/login";</script>');
    }

    // Extract user data from the results
    const user = results[0];

    // Check if the entered password matches the stored password
    if (password !== user.password) {
      return res.send('<script>alert("Invalid password"); window.location.href = "/login";</script>');
    }

    // Set the user session information
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    // Log success and redirect the user
    console.log('User logged in successfully!');
    const script = '<script>alert("Login successful!"); window.location.href = "/";</script>';
    res.send(script);
  });
});

// Define a route for the '/logout' path that destroys the user session
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.send('<script>alert("Login Failed"); window.location.href = "/login";</script>');
    } else {
      // Redirect to the home page after destroying the session
      res.redirect('/');
    }
  });
});

// Define a route for the '/profile' path that renders the 'profile' template
router.get('/profile', function(req, res) {
  // Check if a user is authenticated (has an active session)
  if (!req.session.user) {
    // Redirect to the home page if not authenticated
    return res.redirect('/');
  }

  // Render the 'profile' template with the user information
  res.render('profile', { user: req.session.user });
});

// Define a route for the '/addnewbicycle' path that renders the 'addnewbicycle' template
router.get('/addnewbicycle', function(req, res) {
  res.render('addnewbicycle', { user: req.session.user });
});

// Define a route for handling the form submission to add a new bicycle
router.post('/addnewbicycle', upload.single('image'), (req, res) => {
  // Extract bicycle information from the form submission
  const {
    title,
    quantity,
    price,
    condition,
    description,
    specification,
    color,
    size,
    purchaseMode,
  } = req.body;

  // Convert the uploaded image to a base64 string
  const image = req.file ? req.file.buffer.toString('base64') : null;

  // Construct a SQL query to insert the bicycle into the database
  const insertItemQuery = `
    INSERT INTO bicycles (Title, Quantity, Price, \`Condition\`, Description, Specification, Color, Size, PurchaseMode, Image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  // Values to be inserted into the database
  const insertItemValues = [title, quantity, price, condition, description, specification, color, size, purchaseMode, image];

  // Execute the query to insert the bicycle into the database
  db.query(insertItemQuery, insertItemValues, (error, results) => {
    if (error) {
      console.error('Error inserting item:', error);
      // Send an error message if the insertion fails
      return res.send('<script>alert("Error inserting item!"); window.location.href = "/addnewbicycle";</script>');
    }

    // Log success and redirect the user
    console.log('Item inserted successfully!');
    res.send('<script>alert("Item inserted successfully!"); window.location.href = "/addnewbicycle";</script>');
  });
});

// Define a route for handling the form submission to update user profile
router.post('/profile', (req, res) => {
  // Extract user ID from the session
  const userId = req.session.user.id;
  
  // Extract updated user information from the form submission
  const { name, email } = req.body;

  // Construct a SQL query to update the user profile
  const updateUserQuery = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  const updateUserValues = [name, email, userId];

  // Execute the query to update the user profile
  db.query(updateUserQuery, updateUserValues, (error, results, fields) => {
    if (error) {
      console.error('Error updating user profile:', error);
      // Send an error message if the update fails
      const script = '<script>alert("Error updating user profile"); window.location.href = "/profile";</script>';
      res.send(script);
    }

    // Log success and clear the user session
    console.log('User profile updated successfully!');
    req.session.user = null;

    // Send a success message and redirect the user
    const script = '<script>alert("Profile updated successfully!"); window.location.href = "/profile";</script>';
    res.send(script);
  });
});

// Define a route for the '/deletebycycle' path that deletes a bicycle from the database
router.get('/deletebycycle', function (req, res) {
  // Extract the bicycle ID from the query parameters
  var id = req.query.id;

  // Construct a SQL query to delete the bicycle with the specified ID
  let query = `
    Delete
    FROM bicycles
    WHERE Id = ?
  `;

  // Execute the query with the bicycle ID as a parameter
  db.query(query, [id], (error, results, fields) => {
    if (error) throw error;
  });

  // Send a success message and redirect the user
  const script = '<script>alert("Item Deleted!"); window.location.href = "/index";</script>';
  res.send(script);
});

// Export the router for use in other modules
module.exports = router;
