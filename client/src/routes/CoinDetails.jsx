import React, { useEffect, useState, useRef } from 'react';
import BrowseCoins from '../apis/BrowseCoins';
import { useParams } from 'react-router-dom';
import Chart from '../components/coindetails/Chart';
import Titles from '../components/coindetails/Titles';
import Details from '../components/coindetails/Details';
import '../styles/coindetails.css';
import { LoadingSpinner } from '../styles/Loading.styled';
import Error from '../components/Error';

const CoinDetails = () => {

    const {id} = useParams();
    const [intervalPrices, setIntervalPrices] = useState([]);
    const [time, setTime] = useState([]);
    const [coinDetails, setCoinDetails] = useState();
    const [currentPrice, setCurrentPrice] = useState("");
    const [percent, setPercent] = useState();
    const [ath, setAth] = useState("");
    const [marketCap, setMarketCap] = useState("");
    const [availableSupply, setAvailableSupply] = useState("");
    const [totalSupply, setTotalSupply] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coinDetails = await BrowseCoins.get(`/coin-details/${id}`);
                console.log(coinDetails)
                const priceHistory = await BrowseCoins.get(`/price-history/${id}/24h`);
                console.log(priceHistory)
                const timeData = priceHistory.data.data.history.map(el => el.timestamp * 1000);
                const priceData = priceHistory.data.data.history.map(el => el.price);

                if (mountedRef.current) {
                    console.log(timeData)
                
                    setCoinDetails(coinDetails.data.data.coin);
                    setCurrentPrice(formatNumber(coinDetails.data.data.coin.price));
                    setAth(formatNumber(coinDetails.data.data.coin.allTimeHigh.price));
                    setMarketCap(formatNumber(coinDetails.data.data.coin.marketCap))
                    setAvailableSupply(formatNumber(coinDetails.data.data.coin.supply.circulating));
                    setTotalSupply(formatNumber(coinDetails.data.data.coin.supply.total));
                    setIntervalPrices(priceData);
                    setTime(timeData);
                    setPercent(priceHistory.data.data.change);
                    setLoading(false);
                }
            } catch (err) {
                setError(true);
                console.log(err)
                setErrorMsg(err);
                setLoading(false);
            }
        }
        fetchData();
    },[id])

    const handleIntervalChange = async (e) => {
        const period = e.target.dataset.id;
        const priceDetails = await BrowseCoins.get(`/price-history/${id}/${period}`);
        const timeData = priceDetails.data.data.history.map(el => el.timestamp * 1000);
        const priceData = priceDetails.data.data.history.map(el => el.price);
        setIntervalPrices(priceData);
        setTime(timeData);
    }

    const changePercentChange = (days) => {

    }

    const formatNumber = (price) => {

        if (price === null) price = 'Unlimited';
        else if (price > 1 ) price = price.toLocaleString();
        else if (price < 1 && price > 0.0001) price = price.toLocaleString(undefined, {minimumFractionDigits: 4});
        else price = price.toLocaleString(undefined, {minimumFractionDigits: 8});
        return price;
    }

    return (
        <>
            {loading ? <div className='loading-page'><LoadingSpinner/> </div> :
                <>
                {error ? <Error error={errorMsg}/> : 
                <div className='detail-page'>
                    <Titles price={currentPrice} coinDetails={coinDetails}/>
                    <div className='details'>
                        <Chart coinDetails={coinDetails}
                               price={intervalPrices}
                               currentPrice={currentPrice} 
                               time={time}
                               changeInterval={handleIntervalChange}
                               percent={percent}
                        />
                        <Details price={currentPrice}
                                 ath={ath}
                                 marketCap={marketCap}
                                 availableSupply={availableSupply}
                                 totalSupply={totalSupply}
                                 coinDetails={coinDetails}
                        />
                    </div>
                </div>
                }
                </>
            }
        </>
    )
}

export default CoinDetails
