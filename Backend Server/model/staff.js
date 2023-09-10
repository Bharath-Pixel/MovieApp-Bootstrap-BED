//Name: Sundar Bharath
//Admin Number: 2224178
//Class: DIT/FT/1B/01

var db = require('./databaseConfig.js');
var jwt = require('jsonwebtoken');
var config = require('../config');


var staffDB={
    loginStaff: function (email, password, callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			}
			else {
				console.log("Connected!");
				var sql = 'select * from staff where email=? and password=?';
				conn.query(sql, [email, password], function (err, result) {
					conn.end();
					if (err) {
						console.log("Err: " + err);
						return callback(err, null, null);
					} else {
						var token = "";
						var i;
						if (result.length == 1) {
							token = jwt.sign({ id: result[0].staff_id,}, config.key, {
								expiresIn: 86400 //expires in 24 hrs
							});
							console.log("@@token " + token);
							return callback(null, token, result);
						} else {
							var err2 = new Error("UserID/Password does not match.");
							err2.statusCode = 500;
							return callback(err2, null, null);
						}
					}  //else
				});
			}
		});
	},
	addCustomer: function (store_id, first_name, last_name, email, address_id, callback) { // Method for endpoint 8 to add a customer

        var conn = db.getConnection();
        conn.connect(function (err) { // starts connection to mysql

            if (err) {

                console.log(err);
                return callback(err, null); // if err returns error
            }

            else {
                console.log("Connected!");
                var sql = 'INSERT INTO customer (store_id, first_name, last_name, email, address_id) VALUES (?, ?, ?, ?,?)'; // Sql statement to add a customer

                conn.query(sql, [store_id, first_name, last_name, email, address_id], function (err, result) { // query sent to mysql
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null); // if err return error
                    } else {

                        console.log(result)
                        console.log(result.insertId);
                        return callback(null, result.insertId + ""); // if no error return the newly inserted id as result
                    }
                });
            }

        });
    },
	 addCustomerAddress: function (address_line1, address_line2, district, city_id, postal_code, phone, callback) { 
        var conn = db.getConnection();
        conn.connect(function (err) { // starts connection to mysql

            if (err) {

                console.log(err);
                return callback(err, null); // if err return error
            }

            else {
                console.log("Connected!");

                var sql = 'INSERT INTO address (address, address2, district, city_id, postal_code, phone) VALUES (?, ?, ? ,? ,?, ?)'; // Sql statement to add an address
                conn.query(sql, [address_line1, address_line2, district, city_id, postal_code, phone], function (err, result) { // query sent to mysql
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null); // if err return error
                    } else {

                        console.log(result)
                        console.log(result.affectedRows);
                        return callback(null, result.insertId); // if no error returns the newly inserted id as result
                    }
                });
            }

        });
    },

    removeCustomerAddress: function(addressid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");
                var sql = 'Delete from address where address_id=?';
                conn.query(sql, [addressid] , function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getStore: function(callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");
                var sql = 'SELECT store_id, address FROM store a, address b where a.address_id = b.address_id;';
                conn.query(sql, [] , function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getCities: function (callback) { // Method for endpoint 2 to get list of actor with offset and limit


        var conn = db.getConnection();
        conn.connect(function (err) { // starts the connection to mysql
            if (err) {

                console.log(err);
                return callback(err, null); // if err returns error
            }
            else {
                console.log("Connected");
                var sql = 'SELECT city_id, city from city'; // SQL Statement for endpoint 2
                conn.query(sql, [], function (err, result) {
                    if (err) {

                        console.log(err)
                        return callback(err, null); // if err returns error
                    }

                    else {
                        return callback(null, result); // if no error returns the result for the sql statement
                    }
                }); conn.end();
            }
        });
    }
}
module.exports = staffDB;