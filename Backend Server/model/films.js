//Name: Sundar Bharath
//Admin Number: 2224178
//Class: DIT/FT/1B/01

var db = require("./databaseConfig.js");

var filmsDB = {
  getFilmCategory: function (category_id, callback) {
    // Method for endpoint 6 to get film details within a category

    var conn = db.getConnection();
    conn.connect(function (err) {
      // starts the connection to mysql
      if (err) {
        console.log(err);
        return callback(err, null); // if err return error
      } else {
        console.log("Connected");
        var sql =
          "SELECT film.film_id, film.title, category.name as category, film.rating, film.release_year, film.length as duration from film join film_category on film_category.film_id=film.film_id join category on category.category_id=film_category.category_id WHERE category.category_id =?;"; // sql query for GET
        conn.query(sql, [category_id], function (err, result) {
          // query sent to mysql
          if (err) {
            return callback(err, null); // if err return error
          } else {
            console.log(result);
            return callback(null, result); // if no error returns the result
          }
        });
        conn.end();
      }
    });
  },
  getFilms: function (userid, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("Connected!");
        var sql =
          "SELECT actor_id,first_name,last_name FROM actor WHERE actor_id = ?";
        conn.query(sql, [userid], function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },
};
module.exports = filmsDB;
