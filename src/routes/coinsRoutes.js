const router = require('express').Router();
const CoinsController = require('../controllers/coinsController')

router.get('/', CoinsController.getCoins)
router.get('/:id', CoinsController.getCoin)
router.get('/:id/:period/', CoinsController.getCoinHistory)

module.exports = router;
