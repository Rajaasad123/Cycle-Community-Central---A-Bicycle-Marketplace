const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const secretKey = crypto.randomBytes(32).toString('hex');
const router = express.Router();

router.use(session({
  secret: secretKey,
  resave: true,
  saveUninitialized: true
}));


var db = require('../Database/db')

router.get('/', function(req, res) {
  res.render('home', { user: req.session.user });
});

router.get('/index', function(req, res) {
  const filters = {
      color: req.query.color || [],
      size: req.query.size || [],
      purchaseMode: req.query.purchaseMode || []
  };

  const colorFilters = req.query.color || [];
    const sizeFilters = req.query.size || [];
    const purchaseModeFilters = req.query.purchaseMode || [];

  let query = 'SELECT * FROM bicycles WHERE 1';

  for (const filterName in filters) {
      const filterValues = filters[filterName];

      if (filterValues.length > 0) {
          const valuesArray = Array.isArray(filterValues) ? filterValues : [filterValues];
          query += ` AND ${filterName} IN ('${valuesArray.join("','")}')`;
      }
  }

  console.log(query)

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

router.get('/bicycleDetail', function (req, res) {
  var id = req.query.id;
  let query = `
    SELECT bicycles.*, comments.*
    FROM bicycles
    LEFT JOIN comments ON bicycles.Id = comments.bycycleId
    WHERE bicycles.Id = ?
  `;

  db.query(query, [id], (error, results, fields) => {
    if (error) throw error;

    if (results.length > 0) {
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
    


      res.render('bicycledetail', { data: bicycleData, comments: commentsData,user: req.session.user, });
    } else {
      res.send('No bicycle found with the specified ID');
    }
  });
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send('<script>alert("Password does not match"); window.location.href = "/register";</script>');
  }

  const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  const insertUserValues = [name, email, password];

  db.query(insertUserQuery, insertUserValues, (error, results, fields) => {
    if (error) {
      console.error('Error inserting user:', error);
      return res.send('Registration failed!');
    }

    console.log('User registered successfully!');
    const script = '<script>alert("Registration successful!"); window.location.href = "/";</script>';
    res.send(script);
  });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const getUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(getUserQuery, [email], (error, results, fields) => {
    if (error) {
      console.error('Error getting user:', error);
      return res.send('<script>alert("Login Failed"); window.location.href = "/login";</script>');
    }

    if (results.length === 0) {
      return res.send('<script>alert("User not found"); window.location.href = "/login";</script>');
    }

    const user = results[0];

    if (password !== user.password) {
      return res.send('<script>alert("Invalid password"); window.location.href = "/login";</script>');
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    console.log('User logged in successfully!');
    const script = '<script>alert("Login successful!"); window.location.href = "/";</script>';
    res.send(script);
  });
});

router.get('/logout', (req, res) => {
  
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.send('<script>alert("Login Failed"); window.location.href = "/login";</script>');
    } else {
      res.redirect('/');  
    }
  });
});

router.get('/profile', function(req, res) {
  if (!req.session.user) {
    return res.redirect('/');
  }

  res.render('profile', { user: req.session.user });
});

router.get('/addnewbicycle', function(req, res) {
  res.render('addnewbicycle', { user: req.session.user });
});

router.post('/addnewbicycle', upload.single('image'), (req, res) => {
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

  const image = req.file ? req.file.buffer.toString('base64') : null;

  const insertItemQuery = `
  INSERT INTO bicycles (Title, Quantity, Price, \`Condition\`, Description, Specification, Color, Size, PurchaseMode, Image)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
`;

  const insertItemValues = [title, quantity, price, condition, description, specification, color, size, purchaseMode,image];

  db.query(insertItemQuery, insertItemValues, (error, results) => {
    if (error) {
      console.error('Error inserting item:', error);
      return res.send('<script>alert("Error inserting item!"); window.location.href = "/addnewbicycle";</script>'); 
    }

    console.log('Item inserted successfully!');
    res.send('<script>alert("Item inserted successfully!"); window.location.href = "/addnewbicycle";</script>'); 
  });
});

router.post('/profile', (req, res) => {
  const userId = req.session.user.id;
  
  const { name, email } = req.body;

  const updateUserQuery = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  const updateUserValues = [name, email, userId];

  db.query(updateUserQuery, updateUserValues, (error, results, fields) => {
    if (error) {
      console.error('Error updating user profile:', error);
      const script = '<script>alert("Error updating user profile"); window.location.href = "/profile";</script>';
      res.send(script);
    }

    console.log('User profile updated successfully!');

    req.session.user = null;

    const script = '<script>alert("Profile updated successfully!"); window.location.href = "/profile";</script>';
    res.send(script);
  });
});


router.get('/deletebycycle', function (req, res) {
  var id = req.query.id;
  let query = `
    Delete
    FROM bicycles
    WHERE Id = ?
  `;

  db.query(query, [id], (error, results, fields) => {
    if (error) throw error;
  });

  const script = '<script>alert("Item Deleted!"); window.location.href = "/index";</script>';
    res.send(script);

});

module.exports = router;
