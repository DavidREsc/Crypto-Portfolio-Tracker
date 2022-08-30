const db = require('../db');
const Auth = {}

Auth.create = (email, password) => {
    return db.query('INSERT INTO users (user_email, user_password) VALUES ($1, $2) RETURNING user_email, user_id', [email, password])
}

Auth.get = (email) => {
    return db.query('SELECT * FROM users WHERE user_email = $1', [email])
}

module.exports = Auth