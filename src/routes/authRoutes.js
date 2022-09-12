const router = require('express').Router();
const verify = require('../middleware/verify');
const AuthController = require('../controllers/authController')
const validateInput = require('../middleware/validateInput')
require('dotenv').config();


router.post('/register', validateInput.register, AuthController.register)
router.post('/login', validateInput.login, AuthController.login)
router.post('/logout', AuthController.logout)
router.post('/verify', verify, (req, res) => {
    res.status(200).json('Verified');
})

module.exports = router;
