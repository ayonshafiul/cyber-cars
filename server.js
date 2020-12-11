const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db");

const app = express();

db.connect((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Mysql connected...");
    }
})

app.get('/', (req, res) => {
    res.send("hello");
})


app.listen(process.env.PORT, (req, res) =>  {
    console.log(`Server running on port ${process.env.PORT}`);
})