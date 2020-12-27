// const bcrypt = require('bcryptjs');
// const db = require('./db');
// const mysql = require("mysql");
const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db");
const path = require("path");

const bcrypt = require('bcryptjs');
const { getMaxListeners } = require("process");


const app = express();
const rootDirectoryPath = path.join(__dirname, "public");

db.connect((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Mysql connected...");
    }
});

async function insertAdmin(email,password){
    const hashedPassword = await bcrypt.hash(password,8);
    console.log(hashedPassword);
    var sql = 'INSERT INTO admins SET ?';
    var value = {
        email: email,
        password: hashedPassword
    }
    
    // var sql = "INSERT INTO admins (email, password) VALUES (email, password)";
    db.query(sql,value,function(error, results,fields){
        if(error){
            console.log(error);
        }else{
            console.log(results);
        }
    })


}
insertAdmin('name@g.bracu.com','name');