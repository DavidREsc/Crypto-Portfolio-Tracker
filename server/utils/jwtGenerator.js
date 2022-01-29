const token = require('jsonwebtoken');
require('dotenv').config(); 

const generateJWTToken = (user_id) => {

    const payload = {
        user: user_id
    }

    return token.sign(payload, process.env.JWTSECRET, {expiresIn: '1h'});
}

module.exports = generateJWTToken;
