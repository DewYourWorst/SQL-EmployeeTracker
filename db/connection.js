let mysql = require('mysql');

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"1234",
    database: "employeetracker_db",
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting to db");
        return;
    }
});
module.exports = { connection }