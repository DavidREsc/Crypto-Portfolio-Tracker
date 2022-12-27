const fetch = require('node-fetch');
const Redis = require('ioredis')
const redis = new Redis(process.env.NODE_ENV === 'production' ? process.env.REDIS_URL : {
    'port': process.env.REDISPORT,
    'host': process.env.REDISHOST
})
const CoinsController = {}

CoinsController.getCoins = async(req, res, next) => {
    let promises = [];

    // Data model for response
    let data = {
        coins: [],
        stats: []
    };

    try {
        // Check if coin data is cached
        let cacheEntry = await redis.get('coinList')
        // Return cached data
        if (cacheEntry) {
            return res.status(200).json({
            status: "success",
            data: JSON.parse(cacheEntry)
        })}
        // Get top 1000 coin data from Coinranking api
        for (let i = 0; i < 10; i++) {
            // Push api calls into array
            promises.push(fetch(`https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=_4s0A3Uuu5ML&timePeriod=24h&orderBy=marketCap&orderDirection=desc&limit=100&offset=${i*100}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "coinranking1.p.rapidapi.com",
                    "x-rapidapi-key": process.env.API
                }
            }));
        }
        // Await api calls concurrently
        const response = await Promise.all(promises);
        for (let i = 0; i < response.length; i++) {
            // Merge coin data together
            const responseJson = await response[i].json();
            data.coins = data.coins.concat(responseJson.data.coins);
            // Store global coin stats
            if (i === 0) {
                const globalStats = responseJson.data.stats;
                data.stats = globalStats;
            }
        }
        // Cache coin data
        redis.set('coinList', JSON.stringify(data), 'EX', 180)

        res.status(200).json({
            status: "success",
            data
        });

    } catch (err) {
        console.error(err.message);
        res.status(503).json("Server Error. Failed to retrieve data");
     };
}

CoinsController.getCoin = async (req, res, next) => {
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
}

CoinsController.getCoinHistory = async (req, res, next) => {
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
}

module.exports = CoinsController
