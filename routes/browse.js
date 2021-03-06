const router = require('express').Router();
const fetch = require('node-fetch');
const Redis = require('ioredis')
const redis = new Redis(process.env.NODE_ENV === 'production' ? process.env.REDIS_URL : {
    'port': 6379,
    'host': '127.0.0.1'
})

//Get coin details
router.get('/coin-details/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await fetch(`https://coinranking1.p.rapidapi.com/coin/${id}?referenceCurrencyUuid=_4s0A3Uuu5ML&timePeriod=24h`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "coinranking1.p.rapidapi.com",
                "x-rapidapi-key": process.env.API
            }
        });
        const data = await response.json();

        res.status(200).json({
            status: "success",
            data: data
        });

    } catch (err) {
         console.error(err.message);
         res.status(503).json("Server Error. Failed to retrieve data");
    }
});

//Get coin list
router.get('/coinlist', async(req, res) => {
    let promises = [];
    let data = {
        coins: [],
        stats: []
    };
    try {
        let cacheEntry = await redis.get('coinList')
        if (cacheEntry) {
            return res.status(200).json({
            status: "success",
            data: JSON.parse(cacheEntry)
        })}
        for (let i = 0; i < 10; i++) {
            promises.push(fetch(`https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=_4s0A3Uuu5ML&timePeriod=24h&orderBy=marketCap&orderDirection=desc&limit=100&offset=${i*100}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "coinranking1.p.rapidapi.com",
                    "x-rapidapi-key": process.env.API
                }
            }));
        }
        const response = await Promise.all(promises);
        for (let i = 0; i < response.length; i++) {
            const responseJson = await response[i].json();
            const globalStats = responseJson.data.stats;
            data.coins = data.coins.concat(responseJson.data.coins);
            data.stats = globalStats;
        }
        redis.set('coinList', JSON.stringify(data), 'EX', 180)
        res.status(200).json({
            status: "success",
            data
        });

    } catch (err) {
        console.error(err.message);
        res.status(503).json("Server Error. Failed to retrieve data");
     };
});

//Get coin market details
router.get('/price-history/:id/:period/', async (req, res) => {
    const id = req.params.id;
    const period = req.params.period;

    try {
        const response = await fetch(`https://coinranking1.p.rapidapi.com/coin/${id}/history?referenceCurrencyUuid=_4s0A3Uuu5ML&timePeriod=${period}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "coinranking1.p.rapidapi.com",
                "x-rapidapi-key": process.env.API
            }
        });

        const data = await response.json();
        res.status(200).json({
             status: "success",
             data: data
         });

    } catch (err) {
         console.error(err.message);
         res.status(503).json("Server Error. Failed to retrieve data");
    }  
});


module.exports = router;
