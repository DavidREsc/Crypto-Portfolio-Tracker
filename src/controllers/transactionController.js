const db = require('../db');
const Transaction = require('../models/transaction');
const TransactionController = {}

TransactionController.createTransaction = async (req, res, next) => {
    try {
        const asset = await Transaction.create(req.params, req.body)
        res.status(200).json(asset);
    } catch (error) {
        console.log(error);
        res.send(500)      
    }
}

TransactionController.getTransactions = async (req, res, next) => {
    try {
        const assets = await Transaction.get(req.user)
        res.status(200).json({"portfolios": req.portfolios, "assets": assets.rows});
    } catch (error) {
        console.log(error)  
        res.status(500).json({"errors":[{"msg": "Server Error. Please try again later"}]});    
    }
}

TransactionController.deleteTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.deleteAll(req.params)
        req.transactions = transactions
        next()
    } catch (error) {
        console.log("error");
        res.send(500) 
    }
}

module.exports = TransactionController
