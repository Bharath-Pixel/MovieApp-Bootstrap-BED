//Name: Sundar Bharath
//Admin Number: 2224178
//Class: DIT/FT/1B/01

var express = require("express");
var app = express();
var cors = require("cors");

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json()); // parse application/json
app.use(express.json());
app.use(urlencodedParser);

app.options("*", cors());
app.use(cors());

var actor = require("../model/actors.js");
var film = require("../model/films.js");
var customers = require("../model/customers.js");

var dvdDB = require("../model/dvd.js");
var staffDB = require("../model/staff.js");
var secretKey='abc13nmmbharathpoopyAXz'; 
const jwt = require('jsonwebtoken');
var verifyToken=require('../auth/verifytoken.js')

let err_msg = { error_msg: "Internal server error" };

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//CA2 BED

//Getting films
app.get('/dvdSearchbyName', (req, res) => {
	var name = req.query.name
	var rate = req.query.rate || 10000000     //get rate from request body if not set default to 10000000
	dvdDB.getDVDbyName(name, rate, (err, result) => {
		if (!err) {
			res.send(result)      //send result
		} else {
			res.status(500).send(err_msg);   //send error
		}
	})
})

app.get('/dvdSearchbyCategory', (req, res) => {
	var cat = req.query.category
	var rate = req.query.rate || 100000   //get rate from request body if not set default to 100000
	dvdDB.getDVDbyCategory(cat, rate, (err, result) => {
		if (!err) {
			res.send(result)      //send result
		} else {
			res.status(500).send(err_msg);    //send error
		}
	})
})

app.get('/dvdSearchbyNameandCategory', (req, res) => {
	var name = req.query.name
	var rate = req.query.rate || 10000000   //get rate from request body if not set default to 10000000
  var category = req.query.category

	dvdDB.getDVDbyNameandCategory(name, rate, category, (err, result) => {
		if (!err) {
			res.send(result)  //send result
		} else {
			res.status(500).send(err_msg)     //send error
		}
	})
})

//Getting category dropdown
app.get('/category', (req, res) => {
	dvdDB.getCategory(function(err, result) {
		if (!err) {
			res.send(result)  //send result
		} else {
			res.status(500).send(err_msg) //send error
		}
	})
})

//getting film by id
app.get('/getDetails', (req, res) => {
	var film_id = req.query.film_id   //get film_id from request body
	dvdDB.getDetails(film_id, (err, result) => {
		if (!err) {
			res.send(result)    //send result
		} else {
			res.status(500).send(err_msg)   //send error
		}
	})
})


app.post('/login',function(req, res){
  var email=req.body.email;
  var password = req.body.password;  //get email and password from request body

  staffDB.loginStaff(email, password, function(err, token, result){ //call the loginStaff function in staff.js
      if(!err){
    res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      delete result[0]['password'];//clear the password in json data, do not send back to client
      console.log(result);
    res.json({success: true, UserData: JSON.stringify(result), token:token, status: 'You are successfully logged in!'}); //send the response
    res.send();
  }else{
          res.status(500);
          res.send(err.statusCode);   
      }
  }); 
}); 

//Log out admin
app.post('/logout', function(req, res){
  console.log("..logging out.");
	res.clearCookie('session-id'); //clears the cookie in the response
	res.setHeader('Content-Type', 'application/json'); //set the content type to json
  res.json({success: true, status: 'Log out successful!'});   //send the response
});


//check if user is logged in
app.get('/checkToken', (req, res) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).send({
      valid: false,
      message: 'No token provided.',
    });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        valid: false,
        message: 'Failed to authenticate token.',
      });
    }

    res.status(200).send({
      valid: true,
      decoded,
    });
  });
});


app.get('/city',function(req, res){
  staffDB.getCities(function(err, result){
      if(!err){
    console.log(result)
          res.send(result);
      }else{
    console.log(err)
          res.status(500).send(err_msg);
      }
  });
}); 

app.get('/store',function(req, res){
  staffDB.getStore(function(err, result){
      if(!err){
    console.log(result)
          res.send(result);
      }else{
    console.log(err)
          res.status(500).send(err_msg);
      }
  });
}); 

//CA1 BED
//Endpoint 1
app.get("/actors/:actor_id", function (req, res) {
  var id = req.params.actor_id;
  actor.getActor(id, function (err, result) {
    if (!err) {
      if (result.length == 0) {
        res.status(204).send("No User Found");
      } else {
        res.send(result);
      }
    } else {
      res.status(500).send(err_msg);
    }
  });
});

//Endpoint 2
app.get("/actors", function (req, res) {
  var limit = Number(req.query.limit);
  var offset = Number(req.query.offset);

  actor.getActors(limit, offset, function (err, result) {
    if (!err) {
      res.send(result);
    } else {
      res.status(500).send(err_msg);
    }
  });
});

//Endpoint 3
app.post('/addActors', verifyToken, function (req, res) {
	var fname = req.body.fname;
	var lname = req.body.lname;

	actor.addActor(fname, lname, (err, result) => {
		if (!err) {
			res.status(200).send("Actor inserted at ID: " + result.InsertID)
		} else {
			res.status(500).send(err_msg)
		}
	})
});

//Endpoint 4
app.put("/actors/:actor_id", function (req, res) {
  var actor_id = req.params.actor_id; //params for id input
  //body for data input
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;

  if (
    (first_name == undefined && last_name == undefined) ||
    (first_name == "" && last_name == "")
  ) {
    let missingData = { error_msg: "missing data" };
    return res.status(400).send(missingData);
  }

  actor.updateActor(first_name, last_name, actor_id, function (err, result) {
    if (!err) {
      if (result == 0) {
        res.status(204).send("No Content Found");
      } else {
        let toReturn = { success_msg: "record updated" };
        res.status(200).send(toReturn);
      }
    } else {
      res.status(500).send(err_msg);
    }
  });
});

//Endpoint 5
app.delete("/actors/:actor_id", function (req, res) {
  var actor_id = req.params.actor_id;
  actor.deleteActor(actor_id, function (err, result) {
    if (!err) {
      if (result.affectedRows == 0) {
        res.status(204).send("");
      } else {
        let toReturn = {
          success_msg: "actor deleted",
        };
        res.status(200).send(toReturn);
      }
    } else {
      res.status(500).send(err_msg);
    }
  });
});

//Endpoint 6
app.get("/film_categories/:category_id/films", function (req, res) {
  var id = req.params.category_id;
  film.getFilmCategory(id, function (err, result) {
    if (!err) {
      if (result.length == 0) {
        res.status(204).send("[]");
      } else {
        res.send(result);
      }
    } else {
      res.status(500).send(err_msg);
    }
  });
});

//Endpoint 7
app.get("/customer/:customer_id/payment", function (req, res) {
  var id = req.params.customer_id;
  var start_date = req.query.start_date;
  var end_date = req.query.end_date;
  customers.getCustomers(id, start_date, end_date, function (err, result) {
    if (!err) {
      if (result.length == 0) {
        res.status(204).send("No User Found");
      } else {
        totalAmt = 0;

        for (let i = 0; i < result.length; i++) {
          result[i].amount = parseFloat(result[i].amount);
        }

        for (let i = 0; i < result.length; i++) {
          totalAmt += result[i].amount;
        }

        for (let i = 0; i < result.length; i++) {
          result[i].amount = result[i].amount;
        }

        let toReturn = {
          rental: result,
          total: totalAmt.toFixed(2),
        };

        res.status(200).send(toReturn);
        console.log(typeof result[0].amount);
      }
    } else {
      res.status(500).send(err_msg); 
    }
  });
});


app.post('/customers', verifyToken, function (req, res) { // Endpoint 8 to insert a customer and their address

  var store_id = req.body.store_id; // Stores the store_id
  var first_name = req.body.firstName; // Stores the first_name
  var last_name = req.body.lastName; // Stores the last_name
  var email = req.body.email; // Stores the email
  var address_line1 = req.body.add1; // Stores the address_line1
  var address_line2 = req.body.add2; // Stories the address_line2
  var district = req.body.district; // Stores the district
  var city_id = req.body.city; // Stores the city_id
  var postal_code = req.body.postal; // Stores the postal_code
  var phone = req.body.phone; // Stores the phone number



  staffDB.addCustomerAddress(address_line1, address_line2, district, city_id, postal_code, phone, function // Passes the details as parameters into the addCustomerAddress
      (err, result) {
      if (!err) {
          console.log(result)
          var address_id = result; // Stores the address_id of the newly inserted address

          staffDB.addCustomer(store_id, first_name, last_name, email, address_id, function // Executes this function if addCustomerAddress was successful
              (err, result) {

              if (!err) {
                  let toReturn = {
                      "customer_id": result // Stores the customer_id of the newly inserted customer
                  };
                  res.status(201).send(toReturn) // Returns the customer_id of the newly inserted customer if successful
              }
              else {
                  res.status(500).send(err_msg) // Returns internal server error
              }
          })

      }

      else {

          res.status(500).send(err_msg); // Returns internal server error

      }

  });
})

module.exports = app;
