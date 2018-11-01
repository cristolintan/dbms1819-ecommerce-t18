var exports = module.exports = {};

var Category = {
    list: (client,filter,callback) => {
      const categoryListQuery =  `
        SELECT * FROM products_category ORDER BY category_id ASC
      `;
      client.query(categoryListQuery,(req,result)=>{
      //  console.log(result.rows)
        callback(result.rows)
      });
    },
    mostOrderedCategory: (client, filter, callback) => {
    const query = `
      SELECT products_category.name,SUM(orders.quantity) AS num_orders FROM ((products_category INNER JOIN products ON products_category.category_id = products.category_id) INNER JOIN orders ON orders.product_id = products.product_id) GROUP BY products_category.category_id ORDER BY num_orders DESC LIMIT 3
    `;
    client.query(query, (req, result) => {
      // console.log(result.rows);
      callback(result.rows);
    });
  }
};
module.exports = Category;

