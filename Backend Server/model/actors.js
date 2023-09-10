//Name: Sundar Bharath
//Admin Number: 2224178
//Class: DIT/FT/1B/01

var db = require("./databaseConfig.js");
var actorDB = {
  getActor: function (userid, callback) {
    //Endpoint 1

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
  getActors: function (limit, offset, callback) {
    //Endpoint 2
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("Connected!");
        var sql =
          "SELECT actor_id,first_name,last_name FROM actor ORDER BY first_name LIMIT ? OFFSET ?;";
        conn.query(sql, [limit, offset], function (err, result) {
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
  addActor: function(fname, lname, callback){
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err.null);
        }
        else {
            console.log("Connected!");
            var sql = 'Insert into actor(first_name, last_name) values(?,?)';
            conn.query(sql, [fname, lname] , function (err, result) {
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
  updateActor: function (first_name, last_name, actor_id, callback) {
    //Endpoint 4
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("Connected!");

        if (first_name && !last_name) {
          var sql = "Update actor SET first_name = ? where actor_id = ?";
          var args = [first_name, actor_id];
        } else if (!first_name && last_name) {
          var sql = "Update actor SET last_name = ? where actor_id = ?";
          var args = [last_name, actor_id];
        } else {
          var sql =
            "Update actor SET first_name = ?, last_name = ? where actor_id = ?";
          var args = [first_name, last_name, actor_id];
        }

        conn.query(sql, args, function (err, result) {
          console.log(result);
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            console.log(result);
            return callback(null, result.affectedRows);
          }
        });
      }
    });
  },
  deleteActor: function (actor_id, callback) {
    //Endpoint 5
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("Connected!");

        var sql = "Delete from actor WHERE actor_id = ?;";

        conn.query(sql, [actor_id], function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            console.log(result.affectedRows);
            return callback(null, result);
          }
        });
      }
    });
  },

  
};
module.exports = actorDB;
