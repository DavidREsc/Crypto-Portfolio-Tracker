require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.end("Home Page");
})

app.get('/api/v1/browse/:page', (req, res) => {
    const page = req.params.page;

    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=cad&order=market_cap_desc&per_page=100&page=${page}&sparkline=false`)
     .then(response => response.json())
     .then((data) => {
         res.status(200).json({
             status: "success",
             results: data.length,
             data
         });
     })
     .catch((err) => {
          console.log(err);
          res.end("Error Loading Coins");
     });
})

app.get('/api/v1/browse/price-details/:id', (req, res) => {
    const id = req.params.id;
    fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=cad&days=1`)
     .then(response => response.json())
     .then((data) => {
         res.status(200).json({
             status: "success",
             results: data.length,
             data
         });
     })
     .catch((err) => {
          console.log(err);
          res.end("Error Loading Coin Prices");
     });   
})

app.get('/api/v1/browse/coin-details/:id', (req, res) => {
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
          console.log(err);
          res.end("Error Loading Coin Details");
     });   
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})
