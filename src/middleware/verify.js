const jwt = require('jsonwebtoken');
const Jwt = require('../models/jwt')
require('dotenv').config();

const verify = async (req, res, next) => {
    const token = req.cookies.crypto_portfolio_tracker;
    if (!token) return res.status(200).json({error: "Unauthorized"}); // jwt missing
    try {
        const verify = jwt.verify(token, process.env.JWTSECRET); // verify the jwt
        const response = await Jwt.get(token) // check jwt isn't blacklisted
        if (response.rows.length) return res.status(401).json({error: "Unauthorized"})
        req.user = verify.user; // attach user id to req object for database queries
        next();        
    } catch (e) {
        if (e.message === 'jwt expired') return res.status(401).json({error: "Your session has expired. Please log in again"})
        else res.status(401).json({error: "Unauthorized"});
    }
} 

module.exports = verify;
