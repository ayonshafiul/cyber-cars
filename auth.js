const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies['jwt'];
    if(!token) {
        return res.redirect("/login");
    } else {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        console.log(decodedToken);
    }
    next();
}