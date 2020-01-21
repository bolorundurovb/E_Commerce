var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 

var Product = require('../models/product');

mongoose.connect('mongodb://localhost:27017/ecommercestore'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("Database connection succeeded product"); 
})


/* GET home page. */
router.get('/:id', (req, res, next) => {
    
  Product.findOne({_id: req.params.id}, function(err, docs){
    if(err) {
              res.json(err);
   }
    else {
            res.render('product', {title: 'E-Commerce || Product', product: docs, email: req.cookies.email });
            console.log(docs);
    }
  });

  //res.render('product', { title: 'E-Commerce || Product', email: req.cookies.email });
});



module.exports = router;