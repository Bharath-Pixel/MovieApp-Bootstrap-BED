//Name: Sundar Bharath
//Admin Number: 2224178
//Class: DIT/FT/1B/01

var db = require("./databaseConfig.js");

var dvdDB = {
  //Enter name and rate
  getDVDbyName: function (name, rate, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("Connected!");
        var sql =
          'SELECT films.film_id, films.title, categories.name , films.release_year, films.description, films.rating, films.rental_rate, films.length, languages.name as "language" FROM film films, category categories, film_category fc, language languages WHERE (languages.language_id = films.language_id and categories.category_id = fc.category_id and films.film_id = fc.film_id and LOCATE(?, films.title) and films.rental_rate <= ?);';
        conn.query(sql, [name, rate], function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            console.log(result);
            return callback(null, result);
          }
        });
      }
    });
  },

  //Enter category and rate
  getDVDbyCategory: function (cat, rate, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("Connected!");
        var sql =
          'SELECT films.film_id, films.title, categories.name, films.release_year, films.description, films.rating, films.rental_rate, languages.name as "language", films.length FROM film films, category categories, film_category fc, language languages WHERE (languages.language_id = films.language_id and categories.category_id = fc.category_id and films.film_id = fc.film_id and categories.category_id = ? and films.rental_rate <= ?);';
        conn.query(sql, [cat, rate], function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            console.log(result);
            return callback(null, result);
          }
        });
      }
    });
  },

  //Enter name, category and rate
  getDVDbyNameandCategory: function (name, rate, category, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("Connected!");  
        var sql = 
              'SELECT films.film_id, films.title, categories.name , films.release_year, films.description, films.rating, films.rental_rate, languages.name as "language", films.length FROM film films, category categories, film_category fc, language languages WHERE (languages.language_id = films.language_id and categories.category_id = fc.category_id and films.film_id = fc.film_id and categories.name = ? and films.rental_rate <= ? and LOCATE(?, films.title));';
        conn.query(sql, [name, rate, category], function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            console.log(result);
            return callback(null, result);
          }
        });
      }
    });
  },
  getCategory: function (callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err.null);
      } else {
        console.log("Connected!");
        var sql = "SELECT category_id, name FROM category";
        conn.query(sql, [], function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            console.log(result);
            return callback(null, result);
          }
        });
      }
    });
  },

  getDetails: function(film_id, callback){
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err.null);
        }
        else {
            console.log("Connected!");
            var sql = 'SELECT b.first_name, b. last_name FROM film_actor a, actor b, film c where a.film_id = c.film_id AND a.actor_id = b.actor_id AND c.film_id = ?;'; 
            conn.query(sql, [film_id] , function (err, result) {
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


};
module.exports = dvdDB;
