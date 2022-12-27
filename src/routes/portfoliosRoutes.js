const router = require('express').Router();
const verify = require('../middleware/verify');
const PortfolioController = require('../controllers/portfolioController');
const TransactionController = require('../controllers/transactionController');

router.use('/:portfolioId/transactions', require('./transactionsRoutes'))

router.get('/', verify, PortfolioController.getPortfolios, TransactionController.getTransactions)
router.post('/', verify, PortfolioController.createPortfolio)
router.delete('/:id', verify, TransactionController.deleteTransactions, PortfolioController.deletePortfolio)

module.exports = router;
