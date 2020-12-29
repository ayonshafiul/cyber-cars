const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db");
const path = require("path");
const ejs = require("ejs");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { EMLINK } = require("constants");
const auth = require("./auth");

const app = express();
const rootDirectoryPath = path.join(__dirname, "public");


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
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
    // console.log(req.cookies['jwt']);
    // const user= jwt.verify(req.cookies['jwt'],process.env.JWT_SECRET);
    // console.log(user);
    res.render("index", {
    });
});

app.get("/admin", (req, res) => {
    res.redirect("/admin/login");
})
/*****************************************************/
// Engineer R
// get info of all cars
app.get("/car", function(req, res) {
    let sql = "select * from cars c inner join manufacturers m on c.manufacturerID=m.manufacturerID";
    db.query(sql, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            res.render('allCars', {data: results});
        }
    });
    
});


//get info about one car
app.get("/car/:id", function(req, res) {


    let sql = "select * from cars c inner join manufacturers m on c.manufacturerID=m.manufacturerID where carID = ?";
    db.query(sql, parseInt(req.params.id), function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            res.render("oneCar", {data: results});
        }
    });
    
});

//get info about a manufacturer
app.get("/manufacturer", function(req, res) {
    let sql = "select * from manufacturers";
    db.query(sql, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            res.render('allManufacturers', {data: results});
        }
    });
    
});
// search cars, manufacturers, price range
app.get("/search", function(req, res){
    res.render("userSearch");
});
app.post("/search",function(req, res){
    let word = req.body.search;
    let selectType = req.body.searchType;
    let sql = "";
    let sqlValues = ['%' + word + '%'];
    if (selectType == "model") {
        sql = "select * from cars c inner join manufacturers m on c.manufacturerID=m.manufacturerID where model like ?";
    } else if(selectType == "manufacturer") {
        sql = "select * from cars c inner join manufacturers m on c.manufacturerID=m.manufacturerID where name like ?";
    } else if (selectType == "price") {
        let from = parseInt(req.body.from);
        let to = parseInt(req.body.to);
        sql = "select * from cars c inner join manufacturers m on c.manufacturerID=m.manufacturerID where price between ? and ?"; 
        sqlValues = [from, to];
    }
    db.query(sql, sqlValues, (error, results, fields)=> {
        if (error) {
            console.log(error);
        } else {
            res.render("userSearchList", {data: results});
        } 
    });   
})

/************************************************************/

/***********************************************************/
// Engineer L

app.get("/admin/manufacturer/update", function(req, res) {
    let sql = "SELECT * FROM manufacturers";
    db.query(sql, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            res.render('adminManufacturerList', {data: results});
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
            res.render("adminManufacturerUpdate", {data: results});
        }
    })

});
//Delete

app.get("/admin/manufacturer/delete/:id", function(req, res) {
    const id = req.params.id;
    let sql = "DELETE from manufacturers where manufacturerID = ?";
    db.query(sql, id, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            res.redirect("/admin/manufacturer/update");
        }
    })

});
//

//Search
app.get("/admin/search", function(req, res){
    res.render("adminSearch");
});
app.post("/admin/search",function(req, res){
    let word = req.body.search;
    let selectType = req.body.searchType;
    let sql = "";
    let sqlValues = ['%' + word + '%'];
    if (selectType == "model") {
        sql = "select * from cars c inner join manufacturers m on c.manufacturerID=m.manufacturerID where model like ?";
    } else if(selectType == "manufacturer") {
        sql = "select * from cars c inner join manufacturers m on c.manufacturerID=m.manufacturerID where name like ?";
    } else if (selectType == "price") {
        let from = parseInt(req.body.from);
        let to = parseInt(req.body.to);
        sql = "select * from cars c inner join manufacturers m on c.manufacturerID=m.manufacturerID where price between ? and ?"; 
        sqlValues = [from, to];
    }
    db.query(sql, sqlValues, (error, results, fields)=> {
        if (error) {
            console.log(error);
        } else {
            res.render("adminSearchList", {data: results});
        } 
    });   
})

//manufacturer update
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

//manufucture add
app.get("/admin/manufacturer", function(req, res) {
    res.render("adminManufacturer");
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
// caradd 
app.get("/admin/car", function(req, res) {
    res.render("adminCar");
})

app.post("/admin/car", function(req, res) {
    // first task: insert into database
    
    var sql = 'INSERT INTO cars SET ?';
    var values = {
        color: req.body.color,
        model: req.body.model,
        price: req.body.price,
        stock: req.body.stock,
        engine: req.body.engine,
        rangeKM: req.body.rangeKM,
        braking: req.body.braking,
        maxSpeed: req.body.maxSpeed,
        autoPilot: req.body.autoPilot,
        cameras: req.body.cameras,
        manufacturerID: req.body.manufacturerID,
    };
    db.query(sql, values, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
            res.redirect("/admin/car");
        }
    })
    // show success page

    
})//Till now
//car update
app.get("/admin/car/update", function(req, res) {
    let sql = "SELECT * FROM cars";
    db.query(sql, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            res.render('adminCarList', {data: results});
        }
    });
});

app.get("/admin/car/update/:id", function(req, res) {
    const id = req.params.id;
    let sql = "SELECT * FROM cars where carID = ?";
    db.query(sql, id, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            res.render("adminCarUpdate", {data: results});
        }
    })

});

app.post("/admin/car/update/:id", function(req, res) {
    let sql = mysql.format("UPDATE cars SET color=?, model=?, price=?, stock=?, engine=?, rangeKM=?, braking=?, maxSpeed=?, autoPilot=?, cameras=?, manufacturerID=? where carID=?",
     [req.body.color, req.body.model,req.body.price, req.body.stock, req.body.engine, req.body.rangeKM, req.body.braking, req.body.maxSpeed, req.body.autoPilot, req.body.cameras, req.body.manufacturerID, req.params.id]);
  
     db.query(sql, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log("successfully updated!");
            res.redirect("/admin/car/update");
        }
    })
});
//car delete

app.get("/admin/car/delete/:id", function(req, res) {
    const id = req.params.id;
    let sql = "DELETE from cars where carID = ?";
    db.query(sql, id, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {

            res.redirect("/admin/car/update");
        }
    })

});

/*****************************************************************************/

/****************************************************************************/
// Engineer M
app.get('/login', (req, res) => {
    res.render("login", {data:""});
});

app.get('/admin/login',(req,res)=>{
    res.render('adminLogin',{data:""});
});

app.get("/register", (req, res) => {
    res.render("register", {data:""});
});

app.post('/login', (req, res) => {
    console.log(req.body);
    // res.json(req.body);
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).render('login',{data: 'Please provide an email and password'})
        }

        db.query('SELECT * FROM users WHERE email = ?', [email],async(error,results)=>{
            if(!results || !(await bcrypt.compare(password, results[0].password))){
                res.status(401).render('login',{data: 'Provide correct email and password'})

            }
            else{
                const id= results[0].userID;
                const token=jwt.sign({id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN});

                console.log('The token is'+ token);

                cookieOptions = {
                    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 *60 *60),
                    httpOnly: true
                }
                res.cookie('jwt',token, cookieOptions);
                
                res.status(200).redirect('/');
            }

        });
    }
    catch(error){
        console.log(error);

    }
});

app.post('/admin/login', (req, res) => {
    console.log(req.body);
    // res.json(req.body);
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).render('adminlogin',{data: 'Please provide an email and password'})
        }

        db.query('SELECT * FROM admins WHERE email = ?', [email],async(error,results)=>{
            if(!results || !(await bcrypt.compare(password, results[0].password))){
                res.status(401).render('adminlogin',{data: 'Provide correct email and password'})

            }
            else{
                const id= results[0].email;
                const token=jwt.sign({id},process.env.JWTADMIN_SECRET,{expiresIn: process.env.JWTADMIN_EXPIRES_IN});

                console.log('The token is'+ token);

                cookieOptions = {
                    expires: new Date(Date.now()+process.env.JWTADMIN_COOKIE_EXPIRES * 24 *60 *60),
                    httpOnly: true
                }
                res.cookie('jwtAdmin',token, cookieOptions);
                
                res.status(200).redirect('/');
            }

        });
    }
    catch(error){
        console.log(error);

    }
});


app.post('/register', (req, res) => {
    console.log(req.body);
    // res.json(req.body);

    // insert into database
    
    const{name,phone,email,password, passwordConfirm}=req.body;
    db.query('select email from users where email=?' , [email], async (error,results) => {
       if(error){
           console.log(error);
       } 
       
       if(results.length>0){
           return res.render("register",{data:"email already exits"});
        
       }
       else if(password !== passwordConfirm){
            return res.render("register",{data:"passwords do not match"});
            
       }
   
       var hashedPassword = await bcrypt.hash(password,8);
       console.log(hashedPassword);

       var sql = 'INSERT INTO users SET ?';
        var value = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            phoneNumber: req.body.phone

         };
        db.query(sql, value, function(error, results, fields) {
            if (error) {
            console.log(error);
            } 
            else {
                console.log(results);
                res.render("success");
             }


         });
    });

    

});

app.get("/admin/customerDetails", function(req, res) {
//     console.log(req.cookies['jwtAdmin']);
//    const user= jwt.verify(req.cookies['jwtAdmin'],process.env.JWTADMIN_SECRET);
//    console.log(user);
   let sql = "SELECT * FROM users";
   db.query(sql, function(error, results, fields) {
       if (error) {
           console.log(error);
       } else {
           res.render('adminCustomerDetails', {data: results});
       }
   });

});

app.get("/admin/customerDetails/delete/:id", function(req, res) {
   const id = req.params.id;
   let sql = "DELETE FROM users WHERE userID = ? ";
   
   db.query(sql,[id], function(error,data) {
       if (error) {
           console.log(error);
       } else {
           console.log(data.affectedRows + "record(s) updated");
           res.redirect('/admin/customerDetails');
       }
   });
});
/************************************************************************** */

// Enginer S

app.get("/message", (req, res) => {
    res.render("message", {id: null});
});

app.post("/message", (req, res) => {
    let messageObject = {
        carID: null,
        userID: null,
        message: req.body.message,
        status: "unchecked",
        date: new Date(),
        reply: null
    };
    insertMessage(messageObject, req, res);
});

app.get("/message/:id", (req, res) => {
    res.render("message", {id: req.params.id});
});

app.post("/message/:id", (req, res) => {
    let messageObject = {
        carID: req.params.id,
        userID: null,
        message: req.body.message,
        status: "unchecked",
        date: new Date(),
        reply: null
    };
    insertMessage(messageObject, req, res);
});

app.get("/book/:id", auth, (req, res) => {
    const carID = req.params.id;
    const userID = req.user.id;
    let object = {
        carID,
        userID,
        date: new Date(),
        paymentMethod: "credit"
    };
    db.query("select stock from cars where carID = ?", carID, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json("Error!");
        } else {
            if (results[0].stock > 0) {
                let sql = "INSERT INTO booking SET ?";
                db.query(sql, object, (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        res.json("Error!");
                    } else {
                        db.query("update cars set stock = stock - 1 where carID = ?", carID, (error, results, fields) => {
                            if (error) {
                                console.log(error);
                                res.json("Error!");
                            } else {
                                res.redirect('/');
                            }
                        })
                    }
                })
            } else {
                res.json("Stock unavailable! :(")
            }
            
        }
    })
})

function insertMessage(messageObject, req, res) {
    // TO DO: Check if user is already logged in
    let sql = "INSERT INTO message SET ?";
    db.query(sql, messageObject, (error, results, fields) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect(`/car/${messageObject.carID}`);
        }
    })
}

/***********************************************/
// Engineer N


app.get("/admin/message", (req, res) =>{
    let sql = "select * from message m inner join cars c on m.carID=c.carID";
    let searchType = req.query.sortType;
    if (searchType=="modelasc"){
        sql = "select * from message m inner join cars c on m.carID=c.carID order by model asc";
    } else if (searchType=="modeldesc") {
        sql = "select * from message m inner join cars c on m.carID=c.carID order by model desc";
    } else if (searchType=="dateasc") {
        sql = "select * from message m inner join cars c on m.carID=c.carID order by date asc";
    } else if (searchType=="datedesc") {
        sql = "select * from message m inner join cars c on m.carID=c.carID order by date desc";
    }

    db.query(sql, (error, results, fields) => {
        if ( error) {
            console.log(error);
            res.json(error);
        } else {
            res.render("adminMessages", {data: results});
        }
    })
});

app.get("/admin/message/delete/:messageID", (req, res) => {
    const messageID = req.params.messageID;
    console.log(messageID);
    let sql = "delete from message where messageID = ?";
    db.query(sql, messageID, (error, results, fields) => {
        if ( error) {
            console.log(error);
            res.json(error);
        } else {
            res.redirect("/admin/message");
        }
    });
});

app.get("/admin/carstatus", (req, res) => {
    let sql = "select * from cars c inner join manufacturers ma on c.manufacturerID = ma.manufacturerID";
    const viewType = req.query.viewType;
    if (viewType == "available") {
        sql = "select * from cars c inner join manufacturers ma on c.manufacturerID = ma.manufacturerID where stock > 0";
    } else if (viewType == "outofstock") {
        sql = "select * from cars c inner join manufacturers ma on c.manufacturerID = ma.manufacturerID where stock = 0";
    } else if (viewType == "booked") {
        sql = "select * from booking b inner join users u on b.userID=u.userID inner join cars c on b.carID=c.carID";
    }

    db.query(sql, (error, results, fields) => {
        if ( error) {
            console.log(error);
            res.json("Error!");
        } else {
            if (viewType=="booked") {
                res.render("adminCarStatusBooked", {data: results});
            } else {
                res.render("adminCarStatus", {data: results});
            }
            
        }
    });

});
/***********************************************/
app.listen(process.env.PORT, (req, res) =>  {
    console.log(`Server running on port ${process.env.PORT}`);
})



