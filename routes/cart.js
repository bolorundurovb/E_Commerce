var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); 

var Product = require('../models/product');

mongoose.connect('mongodb://localhost:27017/ecommercestore'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("Database connection succeeded cart"); 
});

router.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180*60*1000 }
}));

/* GET home page. */
router.get('/', (req, res, next) => {
  var cart = req.session.cart;
        var displayCart = {items:[], total:0}
        var total=0;

        //Get Total
        for(var item in cart){
            displayCart.items.push(cart[item]);
            total += (cart[item].qty * cart[item].price);
        }
        displayCart.total = total;

        //Render Cart
      res.render('cart', { title: 'E-Commerce || Cart', email: req.cookies.email, cart: displayCart});
});

router.post('/:id', function (req, res) {
  req.session.cart = req.session.cart || {};
  var cart = req.session.cart;
  console.log(cart);
  
Product.findOne({_id:req.params.id}, function(err,product){
   console.log(product);
      if(err){
          console.log(err);
      }
      if(cart[req.params.id]){
          cart[req.params.id].qty++;

      }
      else{
          cart[req.params.id] = {
              item:product._id,
              title: product.title,
              price: product.price,
              qty: 1,
              imagePath: product.imagePath
          }
          console.log(cart);
      }
      res.redirect('/cart');
      //res.render('./cart', {cart: cart, message:'Added to cart successfully', success:'message'});
      // res.redirect('/cart',);
  });
});


module.exports = router;
