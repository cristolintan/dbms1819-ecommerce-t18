var express = require('express');
var exphbs = require('express-handlebars'); // "express-handlebars"
var nodeMailer = require('nodemailer');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
// var id = null;
var { Client } = require('pg');
var port = process.env.PORT || 3000;
var client = new Client({

  database: 'storedb',
  user: 'postgres',
  password: '12345',
  host: 'localhost',
  port: 5432
});

// connect to database
client.connect()
  .then(function () {
    console.log('connected to database!');
  })
  .catch(function (err) {
    console.log('cannot connect to database!');
  });

app.engine('handlebars', exphbs({defaultLayout: 'main', adminLayout:'admin'})); app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('client/home',{layout: 'main'});
  
});

app.get('/admin', function (req, res) {
client.query('SELECT first_name,last_name,COUNT(orders.orders_id) AS num_orders FROM customer INNER JOIN orders ON customer.customer_id = orders.customer_id GROUP BY orders.customer_id,customer.customer_id ORDER BY num_orders DESC LIMIT 10', (req, top1) => {
    
    res.render('admin/home', {
      layout:'admin',
      data: top1.rows
    });
  });
});
  



app.get('/client/product', function (req, res) {
  client.query('SELECT * FROM products', (req, data1) => {
    res.render('client/product', {
    	layout:'main',
      data: data1.rows
    });
  });
});

app.get('/admin/product', function (req, res) {
  client.query('SELECT * FROM products', (req, data1) => {
    res.render('admin/product', {
    	layout:'admin',
      data: data1.rows
    });
  });
});

app.get('/client/products/:userId', function (req, res) {
  const userId = req.params.userId;
  var temp3 = [];
  var temp4 = [];
  var temp5 = [];
  var desktop = [];
  var products = [];
  var category = [];
  var brand = [];
  var x;

  
  client.query('SELECT * FROM products where product_id=' + userId + ' ', (req, data3) => {
    for (x = 0; x < data3.rowCount; x++) {
      temp3[x] = data3.rows[x];
    }

    products = temp3;

    client.query('SELECT * FROM products_category where category_id=' + products[0].category_id + ' ', (req, data4) => {
      for (x = 0; x < data4.rowCount; x++) {
        temp4[x] = data4.rows[x];
      } category = temp4;

      client.query('SELECT * FROM brands where brand_id=' + products[0].brand_id + ' ', (req, data5) => {
        for (x = 0; x < data5.rowCount; x++) {
          temp5[x] = data5.rows[x];
        } brand = temp5;
        var str = products[0].description;
        var desc = str.split(',');

        res.render('client/productView', {
        	layout:'main',

          prod_id: products[0].product_id,
          prod_picture: products[0].picture,
          prod_name: products[0].name,
          prod_desc: desc,
          prod_tagline: products[0].tagline,
          prod_price: products[0].price,
          prod_warranty: products[0].warranty,
          categoryname: category[0].name,
          brandname: brand[0].name
        });
      });
    });
  });
});

app.get('/admin/products/:userId', function (req, res) {
  const userId = req.params.userId;
  var temp3 = [];
  var temp4 = [];
  var temp5 = [];
  var desktop = [];
  var products = [];
  var category = [];
  var brand = [];
  var x;

  console.log(desktop);
  client.query('SELECT * FROM products where product_id=' + userId + ' ', (req, data3) => {
    for (x = 0; x < data3.rowCount; x++) {
      temp3[x] = data3.rows[x];
    }

    products = temp3;

    client.query('SELECT * FROM products_category where category_id=' + products[0].category_id + ' ', (req, data4) => {
      for (x = 0; x < data4.rowCount; x++) {
        temp4[x] = data4.rows[x];
      } category = temp4;

      client.query('SELECT * FROM brands where brand_id=' + products[0].brand_id + ' ', (req, data5) => {
        for (x = 0; x < data5.rowCount; x++) {
          temp5[x] = data5.rows[x];
        } brand = temp5;
        var str = products[0].description;
        var desc = str.split(',');

        res.render('admin/productView', {

          prod_id: products[0].product_id,
          prod_picture: products[0].picture,
          prod_name: products[0].name,
          prod_desc: desc,
          prod_tagline: products[0].tagline,
          prod_price: products[0].price,
          prod_warranty: products[0].warranty,
          categoryname: category[0].name,
          brandname: brand[0].name
        });
      });
    });
  });
});





// app.post('/send-email/:userId', function (req, res) {
// const userId = req.params.userId;
//   client.query("INSERT INTO customer (name,email,first_name,last_name,street,municipality,province,zipcode) VALUES ('"+req.body.name+"') ");
// res.render('createBrand');
// res.redirect('/categories');
// });




app.get('/admin/createbrand', function (req, res) {
  res.render('admin/createBrand',{
    layout:'admin'
  });
});

app.post('/admin/brand/submit', function (req, res) {
  console.log(req.body.name);
  client.query("INSERT INTO brands (name,description) VALUES ('" + req.body.name + "','" + req.body.description + "') ");
  // res.render('createBrand');
  res.redirect('/admin/brands',{
    layout:'main'
  });
});

app.get('/admin/brands', function (req, res) {
  client.query('SELECT * FROM brands ORDER BY brand_id ASC', (req, data1) => {
    console.log(data1.rows);
    res.render('admin/brands', {
      layout:'admin',
      data: data1.rows
    });
  });
});

app.get('/admin/createcategory', function (req, res) {
  res.render('admin/createCategory',{
    layout:'admin'
  });
});

app.post('/admin/category/submit', function (req, res) {
  console.log(req.body.name);
  client.query("INSERT INTO products_category (name) VALUES ('" + req.body.name + "') ");
  // res.render('createBrand');
  res.redirect('/admin/categories',{
    layout:'main'
  });
});

app.get('/admin/createproduct', function (req, res) {
  var temp4 = [];
  var temp5 = [];
  var category = [];
  var brand = [];
  var x = '';
  client.query('SELECT * FROM products_category ORDER BY category_id ASC', (req, data4) => {
    for (x = 0; x < data4.rowCount; x++) {
      temp4[x] = data4.rows[x];
    } category = temp4;

    client.query('SELECT * FROM brands ORDER BY brand_id ASC', (req, data5) => {
      for (x = 0; x < data5.rowCount; x++) {
        temp5[x] = data5.rows[x];
      } brand = temp5;

      res.render('admin/createProduct', {
        layout:'admin',
        categorydata: category,
        branddata: brand
      });
    });
  });
});

app.post('/admin/product/submit', function (req, res) {
  // console.log(req.body.category);
  client.query("INSERT INTO products (name,description,tagline,price,warranty,category_id,brand_id,picture) VALUES ('" + req.body.name + "','" + req.body.description + "','" + req.body.tagline + "','" + req.body.price + "','" + req.body.warranty + "','" + req.body.category + "','" + req.body.brand + "','" + req.body.picture + "') ");
  // res.render('createBrand');
  res.redirect('/admin/product',{
    layout:'main'
  });
});

app.get('/admin/product/update/:userId', function (req, res) {
  const userId = req.params.userId;
  var temp3 = [];
  var temp4 = [];
  var temp5 = [];
  var desktop = [];
  var products = [];
  var category = [];
  var brand = [];
  var x;

  client.query('SELECT * FROM products where product_id=' + userId + ' ', (req, data3) => {
    for (x = 0; x < data3.rowCount; x++) {
      temp3[x] = data3.rows[x];
    } products = temp3;

    client.query('SELECT * FROM products_category ORDER BY category_id ASC ', (req, data4) => {
      for (x = 0; x < data4.rowCount; x++) {
        temp4[x] = data4.rows[x];
      } category = temp4;

      client.query('SELECT * FROM brands ORDER BY brand_id ASC ', (req, data5) => {
        for (x = 0; x < data5.rowCount; x++) {
          temp5[x] = data5.rows[x];
        } brand = temp5;

        res.render('admin/productupdate', {
          layout:'admin',
          prod_id: products[0].product_id,
          prod_name: products[0].name,
          prod_desc: products[0].description,
          prod_tagline: products[0].tagline,
          prod_picture: products[0].picture,
          prod_price: products[0].price,
          prod_warranty: products[0].warranty,
          prod_cat_id: products[0].category_id,
          prod_brand_id: products[0].brand_id,
          categorydata: category,
          branddata: brand
        });
      });
    });
  });
});

app.post('/admin/product/updatesubmit/:userId', function (req, res) {
  const userId = req.params.userId;
  // console.log(req.body.category);
  client.query("UPDATE products SET name = '" + req.body.name + "',description = '" + req.body.description + "',tagline='" + req.body.tagline + "',price='" + req.body.price + "',warranty='" + req.body.warranty + "',category_id= '" + req.body.category + "',brand_id= '" + req.body.brand + "',picture= '" + req.body.picture + "' WHERE product_id='" + userId + "' ");
  // res.render('createBrand');
  res.redirect('/admin/product',{
    layout:'main'
  });
});

app.get('/admin/categories', function (req, res) {
  client.query('SELECT * FROM products_category ORDER BY category_id ASC', (req, data1) => {
    console.log(data1.rows);
    res.render('admin/categories', {
      layout:'admin',
      data: data1.rows
    });
  });
});

app.get('/admin/customers', function (req, res) {
  client.query('SELECT * FROM customer', (req, data1) => {
    console.log(data1);
    res.render('admin/customers', {
      layout:'admin',
      data: data1.rows
    });
  });
});

app.get('/admin/customer/:custId', function (req, res) {
  const custId = req.params.custId;
  var temp4 = [];
  var temp5 = [];
  var category = [];
  var brand = [];
  var customer = [];
  var orders = '';
  var x = '';

  console.log(brand);
  console.log(category);
  client.query('SELECT * FROM customer WHERE customer_id=' + custId + ' ', (req, data4) => {
    for (x = 0; x < data4.rowCount; x++) {
      temp4[x] = data4.rows[x];
    } customer = temp4;
    console.log(customer);

    client.query('SELECT * FROM orders INNER JOIN products on orders.product_id=products.product_id where customer_id=' + custId + ' ', (req, data5) => {
      for (x = 0; x < data5.rowCount; x++) {
        temp5[x] = data5.rows[x];
      } orders = temp5;
      console.log(orders);

      res.render('admin/customerView', {
        layout:'admin',
        first_name: customer[0].first_name,
        last_name: customer[0].last_name,
        email: customer[0].email,
        street: customer[0].street,
        municipality: customer[0].municipality,
        province: customer[0].province,
        zipcode: customer[0].zipcode,
        data2: orders
      });
    });
  });
});

app.get('/admin/orders', function (req, res) {
  client.query('SELECT * FROM orders INNER JOIN customer ON orders.customer_id=customer.customer_id INNER JOIN products ON orders.product_id=products.product_id ORDER BY orders_id ASC', (req, data1) => {
    console.log(data1.rows);
    res.render('admin/orders', {
      layout:'admin',
      data: data1.rows
    });
  });
});

app.post('/client/send-email/:userId', function (req, res) {
  const userId = req.params.userId;

  client.query("SELECT * FROM customer where email='" + req.body.email + "' ", (req2, data4) => {
    // console.log(data4);
    console.log(data4.rowCount);
    if (data4.rowCount >= 1) {
      client.query("SELECT * FROM customer where email='" + req.body.email + "' ", (req3, data11) => {
        client.query("INSERT INTO orders (customer_id,product_id,quantity,order_date) VALUES ('" + data11.rows[0].customer_id + "','" + userId + "','" + req.body.quantity + "',CURRENT_TIMESTAMP)");
        let transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'team18tanvillabrosa@gmail.com',
            pass: 'team18tan'
          }
        });

        let mailOptions = {
          from: req.body.email, // sender address
          to: 'team18tanvillabrosa@gmail.com', // list of receivers
          subject: 'Team 18 Order Form', // Subject line
          text: '<p>Here is the new customer order request! <br> <b>Product Id</b>: ' + userId + '<br> <b>Product Quantity:</b> ' + req.body.quantity + '<br> <b>Customer Name</b>: ' + req.body.fname + ' ' + req.body.lname + ' <br> <b>Email</b>: ' + req.body.email + '<br> <b>Street</b>: ' + req.body.street + ' <br> <b>Municipality</b>: ' + req.body.municipality + ' <br> <b>Province</b>: ' + req.body.province + ' <br> <b>Zipcode</b>: ' + req.body.zipcode + '</p>', // plain text body
          html: '<p>Here is the new customer order request! <br> <b>Product Id</b>: ' + userId + '<br> <b>Product Quantity:</b> ' + req.body.quantity + '<br> <b>Customer Name</b>: ' + req.body.fname + ' ' + req.body.lname + ' <br> <b>Email</b>: ' + req.body.email + '<br> <b>Street</b>: ' + req.body.street + ' <br> <b>Municipality</b>: ' + req.body.municipality + ' <br> <b>Province</b>: ' + req.body.province + ' <br> <b>Zipcode</b>: ' + req.body.zipcode + '</p>'// html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.render('client/error',{
              layout:'main'
            });

            return console.log(error);
          }

          let mailOptions2 = {
            from: 'team18tanvillabrosa@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: 'Team 18 Product Order Form', // Subject line
            text: '<p>Here are your order request details!! <br> <b>Product Id</b>: ' + userId + '<br> <b>Product Quantity:</b> ' + req.body.quantity + '<br> <b>Customer Name</b>: ' + req.body.fname + ' ' + req.body.lname + ' <br> <b>Email</b>: ' + req.body.email + '<br> <b>Street</b>: ' + req.body.street + ' <br> <b>Municipality</b>: ' + req.body.municipality + ' <br> <b>Province</b>: ' + req.body.province + ' <br> <b>Zipcode</b>: ' + req.body.zipcode + '</p>', // plain text body
            html: '<p>Here are your order request details!! <br> <b>Product Id</b>: ' + userId + '<br> <b>Product Quantity:</b> ' + req.body.quantity + '<br> <b>Customer Name</b>: ' + req.body.fname + ' ' + req.body.lname + ' <br> <b>Email</b>: ' + req.body.email + '<br> <b>Street</b>: ' + req.body.street + ' <br> <b>Municipality</b>: ' + req.body.municipality + ' <br> <b>Province</b>: ' + req.body.province + ' <br> <b>Zipcode</b>: ' + req.body.zipcode + '</p>'// html body
          };

          transporter.sendMail(mailOptions2, (error2, info2) => {
            if (error2) {
              res.render('client/error',{
                layout:'main'
              });

              return console.log(error2);
            }
            console.log('Message %s sent: %s', info2.messageId, info2.response);
            res.render('client/orderSuccess',{
              layout:'main'
            });
          });
        });
      });
    } else if (data4.rowCount === 0) {
      console.log('no data exist!');
      client.query("INSERT INTO customer (email,first_name,last_name,street,municipality,province,zipcode) VALUES ('" + req.body.email + "','" + req.body.fname + "','" + req.body.lname + "','" + req.body.street + "','" + req.body.municipality + "','" + req.body.province + "','" + req.body.zipcode + "')");
      client.query("SELECT * FROM customer where email='" + req.body.email + "' ", (req4, data11) => {
        console.log(data11.rows[0].customer_id + ' ' + userId + ' ' + req.body.quantity);
        client.query("INSERT INTO orders (customer_id,product_id,quantity,order_date) VALUES ('" + data11.rows[0].customer_id + "','" + userId + "','" + req.body.quantity + "',CURRENT_TIMESTAMP)");

        let transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'team18tanvillabrosa@gmail.com',
            pass: 'team18tan'
          }
        });
        let mailOptions = {
          from: req.body.email, // sender address
          to: 'team18tanvillabrosa@gmail.com', // list of receivers
          subject: 'Team 18 Product Order Form', // Subject line
          text: '<p>Please check your order details <br> <b>Product Id</b>: ' + userId + '<br> <b>Product Quantity:</b> ' + req.body.quantity + '<br> <b>Customer Name</b>: ' + req.body.fname + ' ' + req.body.lname + ' <br> <b>Email</b>: ' + req.body.email + '<br> <b>Street</b>: ' + req.body.street + ' <br> <b>Municipality</b>: ' + req.body.municipality + ' <br> <b>Province</b>: ' + req.body.province + ' <br> <b>Zipcode</b>: ' + req.body.zipcode + '</p>', // plain text body
          html: '<p>Please check your order details <br> <b>Product Id</b>: ' + userId + '<br> <b>Product Quantity:</b> ' + req.body.quantity + '<br> <b>Customer Name</b>: ' + req.body.fname + ' ' + req.body.lname + ' <br> <b>Email</b>: ' + req.body.email + '<br> <b>Street</b>: ' + req.body.street + ' <br> <b>Municipality</b>: ' + req.body.municipality + ' <br> <b>Province</b>: ' + req.body.province + ' <br> <b>Zipcode</b>: ' + req.body.zipcode + '</p>'// html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.render('client/error',{
              layout:'main'
            });

            return console.log(error);
          }

          let mailOptions2 = {
            from: 'team18tanvillabrosa@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: 'Team 18 Product Order Form', // Subject line
            text: '<p>Please check your order details!! <br> <b>Product Id</b>: ' + userId + '<br> <b>Product Quantity:</b> ' + req.body.quantity + '<br> <b>Customer Name</b>: ' + req.body.fname + ' ' + req.body.lname + ' <br> <b>Email</b>: ' + req.body.email + '<br> <b>Street</b>: ' + req.body.street + ' <br> <b>Municipality</b>: ' + req.body.municipality + ' <br> <b>Province</b>: ' + req.body.province + ' <br> <b>Zipcode</b>: ' + req.body.zipcode + '</p>', // plain text body
            html: '<p>Please check your order details!! <br> <b>Product Id</b>: ' + userId + '<br> <b>Product Quantity:</b> ' + req.body.quantity + '<br> <b>Customer Name</b>: ' + req.body.fname + ' ' + req.body.lname + ' <br> <b>Email</b>: ' + req.body.email + '<br> <b>Street</b>: ' + req.body.street + ' <br> <b>Municipality</b>: ' + req.body.municipality + ' <br> <b>Province</b>: ' + req.body.province + ' <br> <b>Zipcode</b>: ' + req.body.zipcode + '</p>'// html body
          };

          transporter.sendMail(mailOptions2, (error2, info2) => {
            if (error2) {
              res.render('client/error',{
                layout:'main'
              });

              return console.log(error2);
            }
            console.log('Message %s sent: %s', info2.messageId, info2.response);
            res.render('client/OrderSuccess');
          });
        });
      });
    }
  });
});

app.listen(port, function () {
  console.log('Server started at port ' + port);
});
