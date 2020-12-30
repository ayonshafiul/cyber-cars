const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (typeof req.cookies['jwt'] == 'undefined') {
        return res.redirect("/login");
        
    } else {
        try {
            const token = req.cookies['jwt'];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if(decodedToken.id) {
                req.user = decodedToken;
                next();
            }
        } catch(error) {
                console.log(error);
                res.redirect("/login");
        }
    }
    
}