var exports = module.exports = {};

var Customer = {
  topCustomersHighestPayment: (client, filter, callback) => {
    const query = `
      SELECT first_name,last_name,SUM(products.price) AS totalprice FROM ((customer INNER JOIN orders ON customer.customer_id = orders.customer_id) INNER JOIN products ON products.product_id = orders.product_id) GROUP BY customer.customer_id ORDER BY totalprice DESC LIMIT 10;
    `;
    client.query(query, (req, result) => {
      // console.log(result.rows);
      callback(result.rows);
    });
  },
  topCustomersMostOrder: (client, filter, callback) => {
    const query = `
      SELECT first_name,last_name,COUNT(orders.orders_id) AS num_orders FROM customer INNER JOIN orders ON customer.customer_id = orders.customer_id GROUP BY orders.customer_id,customer.customer_id ORDER BY num_orders DESC LIMIT 10
    `;
    client.query(query, (req, result) => {
      // console.log(result.rows);
      callback(result.rows);
    });
  }
};
module.exports = Customer;
