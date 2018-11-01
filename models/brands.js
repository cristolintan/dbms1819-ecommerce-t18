var exports = module.exports = {};

var Brand = {
    list: (client,filter,callback) => {
      const brandListQuery =  `
        SELECT * FROM brands ORDER BY brand_id ASC
      `;
      client.query(brandListQuery,(req,result)=>{
      //console.log(result.rows)
        callback(result.rows)
      });
    },
     mostOrderedBrand: (client, filter, callback) => {
    const query = `
    SELECT brands.name,SUM(orders.quantity) AS num_orders FROM ((brands INNER JOIN products ON brands.brand_id = products.brand_id) INNER JOIN orders ON orders.product_id = products.product_id) GROUP BY brands.brand_id ORDER BY num_orders DESC LIMIT 3
    `;
    client.query(query, (req, result) => {
      callback(result.rows);
    });
  }

};
module.exports = Brand;