const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies['jwtAdmin'];
    if(!token) {
        return res.redirect("/admin/login");
    } else {
        const decodedToken = jwt.verify(token, process.env.JWTADMIN_SECRET);
        req.admin = decodedToken;
    }
    next();
}