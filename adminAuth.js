const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (typeof req.cookies['jwtAdmin'] == 'undefined') {
        return res.redirect("/admin/login");
        
    } else {
        try {
            const token = req.cookies['jwtAdmin'];
            const decodedToken = jwt.verify(token, process.env.JWTADMIN_SECRET);
            if(decodedToken.id) {
                next();
            }
        } catch(error) {
                console.log(error);
                res.redirect("/admin/login");
        }
    }
    
}