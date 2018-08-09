var express = require('express');
var exphbs = require('express-handlebars'); // "express-handlebars" 
var nodeMailer = require('nodemailer');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var id = null;
var { Client } = require('pg');
var port = process.env.PORT || 3000
var client = new Client({
	
	database: 'storedb',
	user: 'postgres',
	password: '12345',
	host: 'localhost',
	port: 5432,
	
});

// connect to database
client.connect()
	.then(function() {
		console.log('connected to database!')
	})
	.catch(function(err) {
		console.log('cannot connect to database!')
	});



app.engine('handlebars', exphbs({defaultLayout: 'main'})); app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', function (req, res) {
res.render('home');
});


app.get('/productslist', function (req, res) {

client.query("SELECT * FROM products", (req, data1)=>{
	res.render('product',{
		data: data1.rows
	});
	
});
	
	
	
	});


app.get('/products/:userId', function (req, res) {
const userId = req.params.userId;
var temp3 = [];
var temp4 = [];
var temp5 = [];
var desktop = [];
var products = [];
var category = [];
var brand = [];
var x;

client.query("SELECT * FROM products where product_id="+userId+" ", (req, data3)=>{
	
	for(x = 0; x < data3.rowCount; x++){

	temp3[x] = data3.rows[x];

	}	products = temp3;
	
	
		client.query("SELECT * FROM products_category where category_id="+products[0].category_id+" ", (req, data4)=>{
		
		for(x = 0; x < data4.rowCount; x++){

		temp4[x] = data4.rows[x];

		}	category = temp4;
		
		
		client.query("SELECT * FROM brands where brand_id="+products[0].brand_id+" ", (req, data5)=>{
	
		for(x = 0; x < data5.rowCount; x++){

		temp5[x] = data5.rows[x];

		}	brand = temp5;
		var str = products[0].description;
			var desc = str.split(",");
		
		res.render('productview',{
			
			prod_id: products[0].product_id,
			prod_picture: products[0].picture,
			prod_name: products[0].name,
			prod_desc: desc,
			prod_tagline: products[0].tagline,
			prod_price: products[0].price,
			prod_warranty: products[0].warranty,
			categoryname : category[0].name,
			brandname : brand[0].name
			});
	
		});
	
	});

	});
	
	


});

app.get('/brand/create', function (req, res) {

			res.render('brandcreate');
	});
	
app.post('/brand/submit', function (req, res) {
	console.log(req.body.name);
client.query("INSERT INTO brands (name,description) VALUES ('"+req.body.name+"','"+req.body.description+"') ");
	// res.render('brandcreate');
			res.redirect('/brands');
	});	
	
app.get('/brands', function (req, res) {
client.query("SELECT * FROM brands ORDER BY brand_id ASC", (req, data1)=>{
			console.log(data1.rows);
			res.render('brands',{
				data:data1.rows
			});
			
			
		
	});	 
    
});	

app.get('/category/create', function (req, res) {

			res.render('categorycreate');
	});
	
app.post('/category/submit', function (req, res) {
	console.log(req.body.name);
client.query("INSERT INTO products_category (name) VALUES ('"+req.body.name+"') ");
	// res.render('brandcreate');
			res.redirect('/categories');
	});	
	
app.get('/product/create', function (req, res) {
var temp4 = [];
var temp5 = [];
var category = [];
var brand = [];
	client.query("SELECT * FROM products_category ORDER BY category_id ASC", (req, data4)=>{
		
		for(x = 0; x < data4.rowCount; x++){

		temp4[x] = data4.rows[x];

		}	category = temp4;
		
		
		client.query("SELECT * FROM brands ORDER BY brand_id ASC", (req, data5)=>{
	
		for(x = 0; x < data5.rowCount; x++){

		temp5[x] = data5.rows[x];

		}	brand = temp5;

		res.render('productcreate',{
			categorydata : category,
			branddata : brand
			});
	
		});
	
	});
	
	
	
	

			
	});
	
app.post('/product/submit', function (req, res) {
	// console.log(req.body.category);
client.query("INSERT INTO products (name,description,tagline,price,warranty,category_id,brand_id,picture) VALUES ('"+req.body.name+"','"+req.body.description+"','"+req.body.tagline+"','"+req.body.price+"','"+req.body.warranty+"','"+req.body.category+"','"+req.body.brand+"','"+req.body.picture+"') ");
	// res.render('brandcreate');
			res.redirect('/productslist');
	});

app.get('/product/update/:userId', function (req, res) {
const userId = req.params.userId;
var temp3 = [];
var temp4 = [];
var temp5 = [];
var desktop = [];
var products = [];
var category = [];
var brand = [];
var x;
client.query("SELECT * FROM products where product_id="+userId+" ", (req, data3)=>{
	
	for(x = 0; x < data3.rowCount; x++){

	temp3[x] = data3.rows[x];

	}	products = temp3;
	
	
		client.query("SELECT * FROM products_category ORDER BY category_id ASC ", (req, data4)=>{
		
		for(x = 0; x < data4.rowCount; x++){

		temp4[x] = data4.rows[x];

		}	category = temp4;
		
		
		client.query("SELECT * FROM brands ORDER BY brand_id ASC ", (req, data5)=>{
	
		for(x = 0; x < data5.rowCount; x++){

		temp5[x] = data5.rows[x];

		}	brand = temp5;
		
		res.render('productupdate',{
			
			prod_id: products[0].product_id,
			prod_name: products[0].name,
			prod_desc: products[0].description,
			prod_tagline: products[0].tagline,
			prod_picture: products[0].picture,
			prod_price: products[0].price,
			prod_warranty: products[0].warranty,
			prod_cat_id: products[0].category_id,
			prod_brand_id: products[0].brand_id,
			categorydata : category,
			branddata : brand
			});
	
		});
	
	});

	});
	
	
	
	
	
			
	});
	
app.post('/product/updatesubmit/:userId', function (req, res) {
	const userId = req.params.userId;
	// console.log(req.body.category);
client.query("UPDATE products SET name = '"+req.body.name+"',description = '"+req.body.description+"',tagline='"+req.body.tagline+"',price='"+req.body.price+"',warranty='"+req.body.warranty+"',category_id= '"+req.body.category+"',brand_id= '"+req.body.brand+"',picture= '"+req.body.picture+"' WHERE product_id='"+userId+"' ");
	// res.render('brandcreate');
			res.redirect('/productslist');
	});		
	
app.get('/categories', function (req, res) {
client.query("SELECT * FROM products_category ORDER BY category_id ASC", (req, data1)=>{
			console.log(data1.rows);
			res.render('categories',{
				data:data1.rows
			});
			
			
		
	});	 
    
});	
	
	


app.post('/send-email/:userId', function (req, res) {
	 const userId = req.params.userId;
      let smtpTransport = nodeMailer.createTransport({
      	  service: "gmail",
          host: "smtp.gmail.com",
          secure: true,
          auth: {
              user: 'team18tanvillabrosa@gmail.com',
              pass: 'team18tan'
          }
      });
      
      let mailOptions = {
          from: req.body.email, // sender address
          to: 'team18tanvillabrosa@gmail.com', // list of receivers
          subject: 'E-Commerce New Order!!!', // Subject line
          text: 'Product Id: '+ req.body.id+'<br> Customer Name: '+ req.body.cust_name+'/n Phone: '+ req.body.phone +'/n Email: '+ req.body.email +'/n Customer Quantity: '+ req.body.quantity, // plain text body
         // html body
      };

      smtpTransport.sendMail(mailOptions, (error, info) => {
          if (error) {
			  		  res.render('error');
	
              return console.log(error);
		  }
          
          console.log('Message %s sent: %s', info.messageId, info.response);
			  res.render('success');
		  });
      });


app.listen(port, function() {
console.log('Server started at port ' + port);
});