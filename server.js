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

app.get("/admin/manufacturer/update", function(req, res) {
    let sql = "SELECT * FROM manufacturers";
    db.query(sql, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            res.render('manufacturerList', {data: results});
        }
    });
});

app.get("/admin/manufacturer/update/:id", function(req, res) {
    const id = req.params.id;
    let sql = "SELECT * from manufacturers where manufacturerID = ?";
    db.query(sql, id, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            res.render("manufacturerUpdate", {data: results});
        }
    })

});

app.post("/admin/manufacturer/update/:id", function(req, res) {
    let sql = mysql.format("UPDATE manufacturers SET name=?, country=? where manufacturerID=?", [req.body.name, req.body.country, req.params.id]);
    db.query(sql, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log("successfully updated!");
            res.redirect("/admin/manufacturer/update");
        }
    })
});
app.get("/admin/manufacturer", function(req, res) {
    res.render("manufacturer");
})

app.post("/admin/manufacturer", function(req, res) {
    // first task: insert into database
    
    var sql = 'INSERT INTO manufacturers SET ?';
    var values = {
        name: req.body.name,
        country: req.body.country
    };
    db.query(sql, values, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
            res.render("success");
        }
    })
    // show success page

    
})


app.post('/login', (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.post('/register', (req, res) => {
    res.json(req.body);
    // insert into database
    console.log(req.body);
    console.log(req.body.name);

});


app.listen(process.env.PORT, (req, res) =>  {
    console.log(`Server running on port ${process.env.PORT}`);
})