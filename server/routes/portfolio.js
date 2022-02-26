const router = require('express').Router();
const authorize = require('../middleware/authorize');
const db = require('../db');

router.get('/', authorize, async (req, res) => {
    try {
        const portfolios = await db.query(
            'SELECT portfolios.portfolio_id, portfolios.portfolio_name FROM users ' + 
            'LEFT JOIN portfolios ON users.user_id = portfolios.user_id ' +
            'WHERE users.user_id = $1', [req.user]
        );
        const assets = await db.query(
            'SELECT portfolios.portfolio_name, assets.asset_coin_id, assets.asset_amount, assets.initial_price FROM users ' +
            'LEFT JOIN portfolios ON users.user_id = portfolios.user_id ' +
            'INNER JOIN assets ON portfolios.portfolio_id = assets.portfolio_id ' +
            'WHERE users.user_id = $1', [req.user]
        );

        res.status(200).json({"portfolios": portfolios.rows, "assets": assets.rows});

    } catch (error) {
        console.log("error")      
    }
});

router.post('/create-portfolio', authorize, async (req, res) => {
    const {name} = req.body;
    try {
        const portfolio = await db.query(
            'INSERT INTO portfolios (user_id, portfolio_name) ' +
            'VALUES ($1, $2) RETURNING *', [req.user, name]
        );
        res.status(200).json(portfolio);
    } catch (error) {
        console.log("error");
    }
});

router.post('/add-asset', authorize, async (req, res) => {
    const {coin_id, amount, portfolio_id, initial_price} = req.body;
    try {
        const asset = await db.query(
            'INSERT INTO assets (portfolio_id, asset_coin_id, asset_amount, initial_price) ' +
            'VALUES ($1, $2, $3, $4) RETURNING *', [portfolio_id, coin_id, amount, initial_price]
        );
        res.status(200).json(asset);
    } catch (error) {
        console.log(error);      
    }
});

module.exports = router;
