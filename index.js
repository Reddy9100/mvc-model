const express = require("express")
const app = express()
const env = require("dotenv").config()
const bodyParser = require("body-parser")
global.env = env
global.dbconnection = require("./config/database") //NOTE - connection to db
// console.log(dbconnection)
global.dbutil = require("./utils/dbutils") //NOTE - for query function
global.bcrypt = require("bcrypt")
global.jwt = require("jsonwebtoken")
global.cors = require("cors")
global.nodemailer = require("nodemailer")

const port = 3000
//middleware

app.use(bodyParser.json())
app.use(cors())

app.listen(port ,()=>{
    console.log(`server is running on port http://localhost:${port}`)
    
})

app.use(require("./routes/routes"))