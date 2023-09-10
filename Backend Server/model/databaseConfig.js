//Name: Sundar Bharath
//Admin Number: 2224178
//Class: DIT/FT/1B/01

const mysql = require('mysql2');
const dbConnect = {
    getConnection: function () {
    var connection = mysql.createConnection({
        host: "localhost",
        user: "bed_dvd_root",
        password: "pa$$woRD123",
        database: "bed_dvd_db"
    });     
    return connection;
}
};

module.exports = dbConnect;
