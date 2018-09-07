var Brands = {

list: function(client,filter,callback){
	const brandQuery = `
   	  SELECT * 
   	  FROM brands 
   	  ORDER BY brand_id ASC
   `;

    client.query(brandQuery, (req, data1) => {
    console.log(data1.rows);
    callback(data1.rows);
  });

 },

create: function(client,filter,callback){
	const brandCreate = `
	  INSERT INTO brands (name,description) 
	  VALUES ('" + req.body.name + "','" + req.body.description + "') `
	  ;

	client.query(brandCreate);
  }
}

module.exports = Brands