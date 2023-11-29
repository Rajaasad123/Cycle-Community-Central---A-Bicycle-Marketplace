const express = require('express');
const router = express.Router();
var db = require('../Database/db')

router.get('/', function(req, res) {
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
        purchaseModeFilters: purchaseModeFilters
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
    


      res.render('bicycledetail', { data: bicycleData, comments: commentsData });
    } else {
      res.send('No bicycle found with the specified ID');
    }
  });
});




module.exports = router;
