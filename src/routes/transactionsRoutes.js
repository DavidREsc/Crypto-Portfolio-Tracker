const router = require('express').Router({mergeParams: true});
const verify = require('../middleware/verify');
const db = require('../db');
const TransactionController = require('../controllers/transactionController');


router.post('/', verify, TransactionController.createTransaction);

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

module.exports = router
