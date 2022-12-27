const db = require('../db')
const Portfolio = {}

Portfolio.create = (user, {name, main}) => {
    return db.query(
        'INSERT INTO portfolios (user_id, portfolio_name, main) ' +
        'VALUES ($1, $2, $3) RETURNING *', [user, name, main]
    );
}

Portfolio.get = (user) => {
    return db.query(
        'SELECT portfolios.portfolio_id, portfolios.portfolio_name, portfolios.main FROM users ' + 
        'INNER JOIN portfolios ON users.user_id = portfolios.user_id ' +
        'WHERE users.user_id = $1', [user]
    );
}

Portfolio.delete = ({id}) => {
    return db.query(
        'DELETE FROM portfolios WHERE portfolios.portfolio_id = $1 RETURNING *', [id]
    )
}

module.exports = Portfolio
