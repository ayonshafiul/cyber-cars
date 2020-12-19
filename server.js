const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db");
const path = require("path");
const ejs = require("ejs");

const app = express();
const rootDirectoryPath = path.join(__dirname, "public");


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(rootDirectoryPath));


app.set("view engine", "ejs");

db.connect((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Mysql connected...");
    }
});

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/admin/manufacturer", function(req, res) {
    res.render("manufacturer");
})


app.post('/login', (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.post('/register', (req, res) => {
    res.json(req.body);
});


app.listen(process.env.PORT, (req, res) =>  {
    console.log(`Server running on port ${process.env.PORT}`);
})