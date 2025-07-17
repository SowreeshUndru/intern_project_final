const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const redisclient = require("../services/redis");

async function authorization(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        try {
            
               await redisclient.get(token, (err, data) => {
                    
                    if (data) {
                        return res.status(401).json({
                            message: "Unauthorized"
                        });
                    }
                });
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            console.log(decoded);
            next();
        }
        catch (err) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = authorization;