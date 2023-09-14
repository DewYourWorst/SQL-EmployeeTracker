const connect = require("./connection.js");

class DB {
    constructor(connection, firstName, lastName, roleId, managerId) {
        this.connection = connection;
        this.firstName = firstName;
        this.lastName - lastName;
        this.roleId = roleId;
        this.managerId = managerId;
    }

    saveToDB(){}

    getEmployees() {
        return this.connection.query, this.connection, this.firstName, this.lastName, this.roleId, this.managerId;
    }
}
module.exports = DB