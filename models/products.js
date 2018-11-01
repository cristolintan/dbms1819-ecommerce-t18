var exports = module.exports = {};


var Product = {
     list: (client,filter,callback) => {
      const productListQuery =  `
      SELECT * FROM products
      `;
      client.query(productListQuery,(req,result)=>{
        console.log(result.rows)
        callback(result.rows)
      });
    },

     mostOrderedProduct: (client, filter, callback) => {
    const query = `
    SELECT name,SUM(orders.quantity) AS num_orders FROM products INNER JOIN orders ON products.product_id = orders.product_id GROUP BY orders.product_id,products.product_id ORDER BY num_orders DESC LIMIT 10
    `;
    client.query(query, (req, result) => {
      callback(result.rows);
    });
  },

    leastOrderedProduct: (client, filter, callback) => {
    const query = `
    SELECT name,SUM(orders.quantity) AS num_orders FROM products INNER JOIN orders ON products.product_id = orders.product_id GROUP BY orders.product_id,products.product_id ORDER BY num_orders ASC LIMIT 10
    `;
    client.query(query, (req, result) => {
      callback(result.rows);
    });
  }

};
module.exports = Product;