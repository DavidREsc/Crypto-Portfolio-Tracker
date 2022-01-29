const router = require('express').Router();
const fetch = require('node-fetch');

//Get coin details
router.get('/coin-details/:id', (req, res) => {
    const id = req.params.id;
    fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)
     .then(response => response.json())
     .then((data) => {
         res.status(200).json({
             status: "success",
             results: data.length,
             data
         });
     })
     .catch((err) => {
         console.error(err.message);
         res.status(503).json("Server Error. Failed to retrieve data");
     });   
});

//Get coin list
router.get('/coinlist/:page', (req, res) => {
    const page = req.params.page;

    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=cad&order=market_cap_desc&per_page=250&page=${page}&sparkline=false`)
     .then(response => response.json())
     .then((data) => {
         res.status(200).json({
             status: "success",
             results: data.length,
             data
         });
     })
     .catch((err) => {
          console.error(err.message);
          res.status(503).json("Server Error. Failed to retrieve data");
     });
});

//Get coin market details
router.get('/market-details/:id/:days/:interval', (req, res) => {
    const id = req.params.id;
    const days = req.params.days;
    const interval = req.params.interval;
    fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=cad&days=${days}&interval=${interval}`)
     .then(response => response.json())
     .then((data) => {
         res.status(200).json({
             status: "success",
             results: data.length,
             data
         });
     })
     .catch((err) => {
         console.error(err.message);
         res.status(503).json("Server Error. Failed to retrieve data");
     });   
});


module.exports = router;
