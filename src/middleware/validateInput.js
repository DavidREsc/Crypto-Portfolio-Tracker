const yup = require('yup')
const validator = require('validator')

// user input schema for registration
const registerSchema = yup.object().shape({
    email: yup.string()
    .email('Invalid email')
    .required('Please enter your email'),
    password: yup.string()
    .required('Please enter a password')
    .min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup.string()
    .required('Please confirm your password.')
    .oneOf([yup.ref('password')], 'Passwords do not match.') 
})

const loginSchema = yup.object().shape({
    email: yup.string()
    .email('Invalid email')
    .required('Please enter your email'),
    password: yup.string()
    .required('Please enter your password')
})


const validateInput = {}

validateInput.register = async (req, res, next) => {
    try {
        await registerSchema.validate(req.body, {abortEarly: false})
        req.body.email = validator.normalizeEmail(req.body.email)
        next()
    } catch (e) {
        res.status(400).json({error: e.errors[0]})
    }
}

validateInput.login = async (req, res, next) => {
    try {
        await loginSchema.validate(req.body, {abortEarly: false})
        req.body.email = validator.normalizeEmail(req.body.email)
        next()
    } catch (e) {
        res.status(400).json({error: e.errors[0]})
    }
}

module.exports = validateInput