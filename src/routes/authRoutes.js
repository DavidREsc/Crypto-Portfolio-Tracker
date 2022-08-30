const router = require('express').Router();
const authorize = require('../middleware/authorize');
const AuthController = require('../controllers/authController')
const validateInput = require('../middleware/validateInput')
require('dotenv').config();


router.post('/register', validateInput.register, AuthController.register)
router.post('/login', validateInput.login, AuthController.login)

router.get('/logout', (req, res) => {
    res.cookie('crypto_portfolio_tracker', 'none', {
        expires: new Date(1),
        httpOnly: true
    })
    res.status(200).json({success: true, message: "User logged out successfully"});
})

router.post('/verify', authorize, (req, res) => {
    res.status(200).json('Verified');
})

module.exports = router;
