const db = require('../db')
const Jwt = {}

Jwt.create = (token) => {
    return db.query('INSERT INTO jwt_blacklist (jwt) VALUES ($1)', [token])
}

Jwt.get = (token) => {
    return db.query('SELECT * FROM jwt_blacklist WHERE jwt = $1', [token])
}

module.exports = Jwt
