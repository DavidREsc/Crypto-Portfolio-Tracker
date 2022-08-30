const jwt = require('jsonwebtoken');
require('dotenv').config();

const authorize = (req, res, next) => {
    const token = req.cookies.crypto_portfolio_tracker;
    
    if (!token) return res.status(200).json({error: "You are not authorized to view this page"});

    try {
        const verify = jwt.verify(token, process.env.JWTSECRET);
        req.user = verify.user;
        next();        
    } catch (error) {
        res.status(200).json({error: error.message});
    }
} 

module.exports = authorize;
