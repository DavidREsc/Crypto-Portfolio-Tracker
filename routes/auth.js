const router = require('express').Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const transporter = require('../utils/transporter');
const jwtGenerator = require('../utils/jwtGenerator');
const {check, validationResult} = require('express-validator');
const authorize = require('../middleware/authorize');
require('dotenv').config();


router.post('/register', 
    check('email').isEmail().normalizeEmail().withMessage('Invalid email or password'),
    check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters').trim().escape(),
    async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({errors: errors.array()});
        return;
    }

    try {

        const {email, password, confirmPassword} = req.body;

        //Check if password confirmation matches
        if (password !== confirmPassword) return res.status(200).json({"error": "Password confirmation does not match"});

        //Check if email is already in use
        const user = await db.query('SELECT * FROM users WHERE user_email = $1', [email]);
        if (user.rows.length !== 0) return res.status(200).json({"error": "There is already an account with that email"});

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

        /*const URL = `http://localhost:3001/api/v1/auth/verify-account/${token}`
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Confirm Registration",
            html: `<p>Please click this link to confirm your email.</p>
                   <a href=${URL}>${URL}</a>`
        }

        const info = await transporter.sendMail(mailOptions);
        console.log(info)*/
        res.status(200).cookie('token', token, {httpOnly: true});
        res.status(200).json({token});

    } catch (err) {
        res.status(500).json({"errors":[{"msg": "Server Error. Please try again later"}]});
        console.log(err);
    }
});

router.post('/login',
    check('email').isEmail().withMessage('Invalid email or password').normalizeEmail(),
    check('password').trim().escape(),
    async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({errors: errors.array()});

    try {
        const {email, password} = req.body;

        //Check if user exists
        const user = await db.query('SELECT * FROM users WHERE user_email = $1', [email]);
        if (user.rows.length === 0) return res.status(200).json({"error": "No account associated with that email"});

        //Check if password is correct
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        if (!validPassword) return res.status(200).json({"error": "Password is incorrect"});

        //Check if user verified
        //if (!user.rows[0].verified) return res.status(200).json({"error": "Please confirm your email to login"});

        //Generate and return JWT token
        const token = jwtGenerator(user.rows[0].user_id);
        res.status(200).cookie('token', token, {httpOnly: true});
        res.status(200).json({token});

    } catch (err) {
        res.status(500).json({"errors":[{"msg": "Server Error. Please try again later"}]});
    }
})

router.get('/logout', (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(1),
        httpOnly: true
    })
    res.status(200).json({success: true, message: "User logged out successfully"});
})

router.post('/verify', authorize, (req, res) => {
    res.status(200).json('Verified');
})

module.exports = router;
