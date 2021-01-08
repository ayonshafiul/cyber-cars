const faker = require("faker");
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// number of dummy data to generate
const numUsers = 100;
const numManufacturers = 25;
const numCars = 25;
const numMessages = 100;
const numBookings = 30;
const timeBetweenEachEntry = 5;


db.connect((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Mysql connected...");
    }
});

setTimeout(fakeUsers, timeBetweenEachEntry * 1000);
setTimeout(fakeManufacturers, timeBetweenEachEntry * 2 * 1000);
setTimeout(fakeCars, timeBetweenEachEntry * 3 * 1000);
setTimeout(fakeMessages, timeBetweenEachEntry * 4 * 1000);
setTimeout(fakeBookings, timeBetweenEachEntry * 5 * 1000);

function fakeUsers() {
    // generate fake users with password 1234
    const users = [];
    for (let i = 0; i < numUsers; i++) {
        users.push({
            name: faker.name.firstName() + " " + faker.name.lastName(),
            email: faker.internet.email(),
            password: "1234",
            phoneNumber: faker.phone.phoneNumber(),
            address: faker.address.streetAddress() + " " + faker.address.state()  + " " + faker.address.country(),
            creditCard: faker.finance.creditCardNumber()
        })
    }

    users.forEach((user) => {
        db.query('select email from users where email=?' , [user.email], async (error,results) => {
            if(error){
                console.log(error);
            } 
            var hashedPassword = await bcrypt.hash(user.password,8);
            user.password = hashedPassword;
        
            var sql = 'INSERT INTO users SET ?';
            
            db.query(sql, user, function(error, results, fields) {
                if (error) {
                console.log(error);
                } 
                else {
                    // console.log("success!");
                }
            });
        });
    })
    console.log("Done creating fake users!");
}

function fakeManufacturers() {
    // generate manufacturers
    const manufacturers = [];

    for ( let i = 0; i < numManufacturers; i++) {
        manufacturers.push(
            {
                name: faker.vehicle.manufacturer(),
                country: faker.address.country()
            }
        )
    }

    manufacturers.forEach( (manufacturer) => {
        var sql = 'INSERT INTO manufacturers SET ?';
            
        db.query(sql, manufacturer, function(error, results, fields) {
            if (error) {
            console.log(error);
            } 
            else {
                // console.log("success!");
            }
        });
    })
    console.log("Done creating fake manufacturers!");
}


function fakeCars() {
    const cars = [];
    function yesno() {
        if (Math.random() > 0.5) 
            return "yes";
        else 
            return "no";
    }

    for ( let i = 0; i < numCars; i++) {
        cars.push({
        color: faker.commerce.color(),
        model: faker.vehicle.model(),
        price: faker.commerce.price(2000, 12000),
        stock: faker.random.number(20),
        engine: faker.vehicle.type(),
        rangeKM: faker.random.number({'min': 100, 'max': 300}),
        braking: Math.random(),
        maxSpeed: faker.random.number({'min': 120, 'max': 450}),
        autoPilot: yesno(),
        cameras: yesno(),
        manufacturerID: faker.random.number({'min': 1, 'max': numManufacturers}),
        })
    }

    cars.forEach((car) => {
        var sql = 'INSERT INTO cars SET ?';
            
        db.query(sql, car, function(error, results, fields) {
            if (error) {
            console.log(error);
            } 
            else {
                // console.log("success!");
            }
        });
    })
    console.log("Done creating fake cars!");
}

function fakeMessages() {
    const messages = [];
    for ( let i = 0; i < numMessages; i++) {
        messages.push({ 
            userID: faker.random.number({'min': 1, 'max': numUsers}),
            carID: faker.random.number({'min': 1, 'max': numCars}),
            message: faker.lorem.words(20),
            reply: faker.lorem.words(20),
            status: "unchecked",
            date: faker.date.past(2)
        })
    }
    messages.forEach((message) => {
        var sql = 'INSERT INTO message SET ?';
             
        db.query(sql, message, function(error, results, fields) {
            if (error) {
            console.log(error);
            } 
            else {
                // console.log("success!");
            }
        });
    })
    console.log("Done creating fake messages!");
}

function fakeBookings() {
    const bookings = [];

    for (let i = 0; i < numBookings; i++) {
        bookings.push({
            userID: faker.random.number({'min': 1, 'max': numUsers}),
            carID: faker.random.number({'min': 1, 'max': numCars}),
            date: faker.date.recent(30),
            paymentMethod: "credit",
        })
    }

    bookings.forEach((booking) => {
        var sql = 'INSERT INTO booking SET ?';
            
        db.query(sql, booking, function(error, results, fields) {
            if (error) {
            console.log(error);
            } 
            else {
                // console.log("success!");
            }
        });
    })
    console.log("Done creating fake bookings!");
    console.log("Press ctrl + c to exit....");
}
