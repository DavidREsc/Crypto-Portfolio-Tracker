const Portfolio = require('../models/portfolio');
const Transaction = require('../models/transaction');
const PortfolioController = {}

PortfolioController.createPortfolio = async (req, res, next) => {
    try {
        const portfolio = await Portfolio.create(req.user, req.body)
        res.status(200).json(portfolio);
    } catch (error) {
        console.log("error");
        res.status(500).send(error)
    }
}

PortfolioController.getPortfolios = async (req, res, next) => {
    try {
        const portfolios = await Portfolio.get(req.user)
        req.portfolios = portfolios.rows
        next()
    } catch (error) {
        console.log(error)  
        res.status(500).json({"errors":[{"msg": "Server Error. Please try again later"}]});    
    }
}

PortfolioController.deletePortfolio = async (req, res, next) => {
    try {
        const portfolio = await Portfolio.delete(req.params)
        res.status(200).json({transactions: req.transactions, portfolio});
    } catch (error) {
        console.log("error");
        res.send(500)
    }
}

module.exports = PortfolioController
