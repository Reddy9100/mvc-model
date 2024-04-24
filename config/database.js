const mysql = require("mysql2")


const createConnection = mysql.createPool({
    host :"localhost",
    user : "root",
    password : "root123",
    database : "dockerdatabase",
})

// console.log(createConnection)

module.exports = createConnection