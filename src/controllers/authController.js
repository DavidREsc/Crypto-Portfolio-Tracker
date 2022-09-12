const Auth = require('../models/auth')
const Jwt = require('../models/jwt')
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const AuthController = {}

// Create a user
AuthController.register = async (req, res, next) => {
    const {email, password} = req.body
    try {
        const user = await Auth.get(email)
        // Check if user already exists
        if (user.rows.length) {
            return res.status(400).json({error: "Account already exists with that email"})
        }
            
        // hash password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // create new user in database
        const newUser = await Auth.create(email, bcryptPassword)
        // generate new jwt
        const token = jwtGenerator(newUser.rows[0].user_id);
        // set http only cookie with jwt 
        res.cookie('crypto_portfolio_tracker', token, {httpOnly: true})
        res.status(201).json({email: newUser.rows[0].user_email})
    } catch (e) {
        res.status(500).json({error: "Server error"})
    }
    next()
}

// user login
AuthController.login = async (req, res, next) => {
    const {email, password} = req.body
    
    try {
        // check that user exists
        const user = await Auth.get(email)
        if (!user.rows.length) return res.status(401).json({error: "No account associated with that email"})

        // check that password is correct
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password)
        if (!validPassword) return res.status(401).json({error: "Password is incorrect"})

        // generate jwt
        const token = jwtGenerator(user.rows[0].user_id)
        res.cookie('crypto_portfolio_tracker', token, {httpOnly: true})
        res.status(200).json({email: user.rows[0].email})
    } catch (e) {
        res.status(500).json({error: "Server error"})
    }
    next()
}

AuthController.logout = async (req, res, next) => {
    const token = req.cookies.crypto_portfolio_tracker
    try {
        // blacklist the token
        await Jwt.create(token)
        // remove jwt from client
        res.cookie('crypto_portfolio_tracker', 'none', {
            expires: new Date(1),
            httpOnly: true
        })
        res.status(200).send()
    } catch (e) {
        res.status(500).json({error: "Server error"})
    }
    next()
}

module.exports = AuthController
