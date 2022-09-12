const router = require('express').Router();
const verify = require('../middleware/verify');
const db = require('../db');

router.get('/', verify, async (req, res) => {
    try {
        const portfolios = await db.query(
            'SELECT portfolios.portfolio_id, portfolios.portfolio_name, portfolios.main FROM users ' + 
            'INNER JOIN portfolios ON users.user_id = portfolios.user_id ' +
            'WHERE users.user_id = $1', [req.user]
        );
        const assets = await db.query(
            'SELECT portfolios.portfolio_id, transactions.asset_id, transactions.asset_amount, transactions.initial_price, transactions.transaction_id, transactions.transaction_type, transactions.transaction_date FROM users ' +
            'LEFT JOIN portfolios ON users.user_id = portfolios.user_id ' +
            'INNER JOIN transactions ON portfolios.portfolio_id = transactions.portfolio_id ' +
            'WHERE users.user_id = $1 ORDER BY transaction_date', [req.user]
        );
        res.status(200).json({"portfolios": portfolios.rows, "assets": assets.rows});

    } catch (error) {
        console.log(error)  
        res.status(500).json({"errors":[{"msg": "Server Error. Please try again later"}]});    
    }
});

router.post('/create-portfolio', verify, async (req, res) => {
    const {name, main} = req.body;
    try {
        const portfolio = await db.query(
            'INSERT INTO portfolios (user_id, portfolio_name, main) ' +
            'VALUES ($1, $2, $3) RETURNING *', [req.user, name, main]
        );
        res.status(200).json(portfolio);
    } catch (error) {
        console.log("error");
        res.send(500)
    }
});

router.delete('/delete-portfolio', async (req, res) => {
    const {portfolio_id} = req.body;
    try {
        const transactions = await db.query(
            'DELETE FROM transactions WHERE transactions.portfolio_id = $1 RETURNING *', [portfolio_id]
        );
        const portfolio = await db.query(
            'DELETE FROM portfolios WHERE portfolios.portfolio_id = $1 RETURNING *', [portfolio_id]
        )
        res.status(200).json({transactions, portfolio});
    } catch (error) {
        console.log("error");
        res.send(500)
        
    }
})

router.post('/add-transaction', verify, async (req, res) => {
    const {coin_id, quantity, portfolio_id, pricePerCoin, type, date} = req.body;
    try {
        const asset = await db.query(
            'INSERT INTO transactions (portfolio_id, asset_id, asset_amount, initial_price, transaction_type, transaction_date) ' +
            'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [portfolio_id, coin_id, quantity, pricePerCoin, type, date]
        );
        res.status(200).json(asset);
    } catch (error) {
        console.log(error);
        res.send(500)      
    }
});

router.delete('/delete-asset', verify, async (req, res) => {
    const {coin_id, portfolio_id} = req.body;
    try {
        const asset = await db.query(
            'DELETE FROM transactions WHERE transactions.asset_id = $1 AND transactions.portfolio_id = $2 RETURNING *',
            [coin_id, portfolio_id]
        )
        res.status(200).json(asset);
    } catch (err) {
        console.log(err);
        res.send(500)
    }
});

router.delete('/delete-transaction', verify, async (req, res) => {
    const {transaction_id} = req.body;
    try {
        const asset = await db.query(
            'DELETE FROM transactions WHERE transactions.transaction_id = $1 RETURNING *' ,
            [transaction_id]
        )
        res.status(200).json(asset);
    } catch (error) {
        console.log(error);
        res.send(500)
    }
})

router.put('/edit-transaction', verify, async (req, res) => {
    const {quantity, pricePerCoin, asset_id} = req.body;
    try {
        const transaction = await db.query(
            'UPDATE transactions SET asset_amount = $1, initial_price = $2 WHERE transactions.transaction_id = $3 RETURNING *',
            [quantity, pricePerCoin, asset_id]
        )
        res.status(200).json(transaction);    
    } catch (error) {
        console.log(error); 
        res.send(500)      
    }
})

module.exports = router;
