const router = require('express').Router();
const authorize = require('../middleware/authorize');
const db = require('../db');

router.get('/', authorize, async (req, res) => {
    try {
        const portfolios = await db.query(
            'SELECT portfolios.portfolio_id, portfolios.portfolio_name, portfolios.main FROM users ' + 
            'LEFT JOIN portfolios ON users.user_id = portfolios.user_id ' +
            'WHERE users.user_id = $1', [req.user]
        );
        const assets = await db.query(
            'SELECT portfolios.portfolio_id, assets.asset_coin_id, assets.asset_amount, assets.initial_price, assets.asset_id FROM users ' +
            'LEFT JOIN portfolios ON users.user_id = portfolios.user_id ' +
            'INNER JOIN assets ON portfolios.portfolio_id = assets.portfolio_id ' +
            'WHERE users.user_id = $1', [req.user]
        );

        res.status(200).json({"portfolios": portfolios.rows, "assets": assets.rows});

    } catch (error) {
        console.log("error")  
        res.status(500).json({"errors":[{"msg": "Server Error. Please try again later"}]});    
    }
});

router.post('/create-portfolio', authorize, async (req, res) => {
    const {name, main} = req.body;
    try {
        const portfolio = await db.query(
            'INSERT INTO portfolios (user_id, portfolio_name, main) ' +
            'VALUES ($1, $2, $3) RETURNING *', [req.user, name, main]
        );
        res.status(200).json(portfolio);
    } catch (error) {
        console.log("error");
    }
});

router.delete('/delete-portfolio', async (req, res) => {
    const {portfolio_id} = req.body;
    try {
        const transactions = await db.query(
            'DELETE FROM assets WHERE assets.portfolio_id = $1 RETURNING *', [portfolio_id]
        );
        const portfolio = await db.query(
            'DELETE FROM portfolios WHERE portfolios.portfolio_id = $1 RETURNING *', [portfolio_id]
        )
        res.status(200).json({transactions, portfolio});
    } catch (error) {
        console.log("error");
        
    }
})

router.post('/add-transaction', authorize, async (req, res) => {
    const {coin_id, quantity, portfolio_id, pricePerCoin} = req.body;
    try {
        const asset = await db.query(
            'INSERT INTO assets (portfolio_id, asset_coin_id, asset_amount, initial_price) ' +
            'VALUES ($1, $2, $3, $4) RETURNING *', [portfolio_id, coin_id, quantity, pricePerCoin]
        );
        res.status(200).json(asset);
    } catch (error) {
        console.log(error);      
    }
});

router.delete('/delete-asset', authorize, async (req, res) => {
    const {coin_id, portfolio_id} = req.body;
    try {
        const asset = await db.query(
            'DELETE FROM assets WHERE assets.asset_coin_id = $1 AND assets.portfolio_id = $2 RETURNING *',
            [coin_id, portfolio_id]
        )
        res.status(200).json(asset);
    } catch (err) {
        console.log(err);
    }
});

router.delete('/delete-transaction', authorize, async (req, res) => {
    const {asset_id} = req.body;
    try {
        const asset = await db.query(
            'DELETE FROM assets WHERE assets.asset_id = $1 RETURNING *' ,
            [asset_id]
        )
        res.status(200).json(asset);
    } catch (error) {
        console.log(error);
    }
})

router.put('/edit-transaction', authorize, async (req, res) => {
    const {asset_amount, initial_price, asset_id} = req.body;
    try {
        const transaction = await db.query(
            'UPDATE assets SET asset_amount = $1, initial_price = $2 WHERE assets.asset_id = $3 RETURNING *',
            [asset_amount, initial_price, asset_id]
        )
        res.status(200).json(transaction);    
    } catch (error) {
        console.log(error);       
    }
})

module.exports = router;
