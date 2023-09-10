//Name: Sundar Bharath
//Admin Number: 2224178
//Class: DIT/FT/1B/01

var db = require('./databaseConfig.js');


var customersDB={
    getCustomers: function (customer_id, start_date, end_date, callback) { // Endpoint 7

        var conn = db.getConnection();
        conn.connect(function (err) { // starts the connection to mysql
            if (err) {
                console.log(err);
                return callback(err, null); // if err return error
            }
            else {
                console.log("Connected");
                var sql = 'SELECT film.title, payment.amount, payment.payment_date FROM payment JOIN rental ON payment.rental_id = rental.rental_id JOIN inventory ON rental.inventory_id = inventory.inventory_id JOIN film ON inventory.film_id = film.film_id WHERE payment.customer_id = ? AND (payment.payment_date BETWEEN ? AND ?)'; // sql query for GET
                conn.query(sql, [customer_id, start_date, end_date], function (err, result) { // query sent to mysql
                    if (err) {
                        return callback(err, null); // if err return error
                    }

                    else {
                        console.log(result)
                        return callback(null, result); // if no error returns the result
                    }
                }); conn.end();
            }
        });
    },


    addCustomers: function (store_id, first_name, last_name, email, address_line1, address_line2, district, city_id, postal_code, phone, callback) { // Endpoint 8

        var conn = db.getConnection();
        conn.connect(function (err) { // starts the connection to mysql
            if (err) {
                console.log(err);
                return callback(err, null); // if err return error
            }
            else {
                const find_email = "SELECT * FROM customer WHERE email = ?";
                conn.query(find_email, [email], (error, results) => {
                    if (results.length != 0) {
                        return callback(null, 0)
                    } else {
                        const sql1 = "INSERT INTO address(address, address2, district, city_id, postal_code, phone) VALUES (?,?,?,?,?,?)";
                        conn.query(sql1, [address_line1, address_line2, district, city_id, postal_code, phone], (error, results) => {
                            if (error) {
                                return callback(error, null);
                            };
                            const addressID = results.insertId;
                            const sql2 = "INSERT INTO customer(store_id, first_name, last_name, email, address_id) VALUES(?, ?, ?, ?, ?);"
                            conn.query(sql2, [store_id, first_name, last_name, email, addressID], (err, results) => {
                                conn.end();
                                console.log()
                                if (err) {
                                    return callback(err, null);
                                }
                                return callback(null, results)
                            })
                        });
                    }
                });
            }
        });
    }
}
module.exports = customersDB;