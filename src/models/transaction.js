const db = require('../db')
const Transaction = {}

Transaction.get = (user) => {
    return db.query(
        'SELECT portfolios.portfolio_id, transactions.asset_id, transactions.asset_amount, transactions.initial_price, transactions.transaction_id, transactions.transaction_type, transactions.transaction_date FROM users ' +
        'JOIN portfolios ON users.user_id = portfolios.user_id ' +
        'JOIN transactions ON portfolios.portfolio_id = transactions.portfolio_id ' +
        'WHERE users.user_id = $1 ORDER BY transaction_date', [user]
    );
}

Transaction.deleteAll = ({id}) => {
    return db.query(
        'DELETE FROM transactions WHERE transactions.portfolio_id = $1 RETURNING *', [id]
    );
}

Transaction.create = ({portfolioId}, {coin_id, quantity, pricePerCoin, type, date}) => {
    return db.query(
        'INSERT INTO transactions (portfolio_id, asset_id, asset_amount, initial_price, transaction_type, transaction_date) ' +
        'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [portfolioId, coin_id, quantity, pricePerCoin, type, date]
    );
}

module.exports = Transaction
