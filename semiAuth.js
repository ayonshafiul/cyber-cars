const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (typeof req.cookies['jwt'] != 'undefined' ) {
        try {
            const token = req.cookies['jwt'];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedToken;
        } catch(error) {
            console.log(error);
        }     
    }
    next();
}