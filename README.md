# cse370project
A simple online car showroom project built using nodejs and mysql database


# Installation
create an .env file inside the root directory with the following information

```sh
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB=car_showroom
PORT=8080
JWT_SECRET = secretpassword
JWT_EXPIRES_IN = 90d
JWT_COOKIE_EXPIRES = 90
JWTADMIN_SECRET = iamtheadmin
JWTADMIN_EXPIRES_IN = 90d
JWTADMIN_COOKIE_EXPIRES = 90
```
By default the mysql database name is car_showroom
create the database using phpmyadmin or mysql client 
populate the database with required tables using contents from the sqlTables
or simply copy the following code from below

```sh
CREATE TABLE users (
    userID int AUTO_INCREMENT,
    name varchar(50),
    email varchar(50),
    password varchar(255),
    address varchar(255),
    phoneNumber varchar(20),
    creditCard varchar(100),
    Primary Key(userID)
);

CREATE TABLE manufacturers(
    manufacturerID int AUTO_INCREMENT,
    name varchar(20),
    country varchar(20),
    Primary Key(manufacturerID)
);

CREATE TABLE cars (
    carID INT AUTO_INCREMENT,
    color varchar(15),
    model varchar(30),
    price decimal(8,2),
    stock int,
    engine varchar(30),
    rangeKM int,
    braking decimal(3,2),
    maxSpeed int,
    autoPilot varchar(20),
    cameras varchar(20),
    manufacturerID int,
    Primary Key(carID),
    Foreign Key(manufacturerID) references manufacturers(manufacturerID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE message (
    messageID int AUTO_INCREMENT,
    userID int,
    carID int,
    message varchar(500),
    reply varchar(500),
    status varchar(20),
    date datetime,
    Primary Key(messageID),
    Foreign Key(userID) references users(userID)  ON DELETE CASCADE ON UPDATE CASCADE,
    Foreign Key(carID) references cars(carID) ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE booking (
    bookingID int AUTO_INCREMENT,
    userID int,
    carID int,
    date datetime,
    paymentMethod varchar(20),
    Primary Key(bookingID),
    Foreign Key(userID) references users(userID) ON UPDATE CASCADE ON DELETE CASCADE,
    Foreign Key(carID) references cars(carID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE photos (
    carID INT AUTO_INCREMENT,
    photo varchar(255),
    Primary Key(carID, photo),
    Foreign Key(carID) references cars(carID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE admins (
    email varchar(50),
    password varchar(255),
    Primary Key(email)
);
```

to start the server simply run

```sh
node server.js
```