const router = require('express').Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const {check, validationResult} = require('express-validator');
require('dotenv').config();

router.post('/register', 
    check('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters').trim().escape(),
    async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.mapped()});

    try {
        const {email, password} = req.body;
        console.log(password);

        //Check if email is already in use
        const user = await db.query('SELECT * FROM users WHERE user_email = $1', [email]);
        if (user.rows.length !== 0) return res.status(200).json("Email is already in use");

        //Encrypt password
        const saltRounds = parseInt(process.env.SALTROUNDS);
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, salt);

        //Add new user to database
        const newUser = await db.query(
            'INSERT INTO users (user_email, user_password) VALUES ($1, $2) RETURNING *', 
            [email, bcryptPassword]
        );

        //Generate and return JWT token
        const token = jwtGenerator(newUser.rows[0].user_id);
        res.status(200).json({token});

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.post('/login',
    check('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    check('password').trim().escape(),
    async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.mapped()});

    try {
        const {email, password} = req.body;

        //Check if user exists
        const user = await db.query('SELECT * FROM users WHERE user_email = $1', [email]);
        if (user.rows.length === 0) return res.status(200).json("Email does not exist");

        //Check if password is correct
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        if (!validPassword) return res.status(200).json("Password is incorrect");

        //Generate and return JWT token
        const token = jwtGenerator(user.rows[0].user_id);
        res.status(200).json({token});

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

module.exports = router;
