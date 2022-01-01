import React, { useEffect, useState } from 'react';
import BrowseCoins from '../apis/BrowseCoins';
import { useParams } from 'react-router-dom';
import Chart from '../components/coindetails/Chart';
import Titles from '../components/coindetails/Titles';
import Details from '../components/coindetails/Details';
import '../styles/coindetails.css';
import { LoadingSpinner } from '../styles/Loading.styled';

const CoinDetails = () => {

    const {id} = useParams();
    const [intervalPrices, setIntervalPrices] = useState([]);
    const [time, setTime] = useState([]);
    const [coinDetails, setCoinDetails] = useState([]);
    const [currentPrice, setCurrentPrice] = useState("");
    const [percent, setPercent] = useState();
    const [ath, setAth] = useState("");
    const [atl, setAtl] = useState("");
    const [marketCap, setMarketCap] = useState("");
    const [totalVolume, setTotalVolume] = useState("");
    const [availableSupply, setAvailableSupply] = useState("");
    const [totalSupply, setTotalSupply] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coinDetails = await BrowseCoins.get(`/coin-details/${id}`);
                const priceDetails = await BrowseCoins.get(`/price-details/${id}/1`);

                setCoinDetails(coinDetails.data.data);
                setCurrentPrice(formatNumber(coinDetails.data.data.market_data.current_price.cad));
                setAth(formatNumber(coinDetails.data.data.market_data.ath.cad));
                setAtl(formatNumber(coinDetails.data.data.market_data.atl.cad));
                setMarketCap(formatNumber(coinDetails.data.data.market_data.market_cap.cad))
                setAvailableSupply(formatNumber(coinDetails.data.data.market_data.circulating_supply));
                setTotalSupply(formatNumber(coinDetails.data.data.market_data.max_supply));
                setTotalVolume(formatNumber(coinDetails.data.data.market_data.total_volume.cad));

                const priceData = priceDetails.data.data.prices.map(el => el[1]);
                const timeData = priceDetails.data.data.prices.map(el => el[0]);
                setIntervalPrices(priceData);
                setTime(timeData);
                setPercent(coinDetails.data.data.market_data.price_change_percentage_24h);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
        return () => {
            setCoinDetails({});
            setCurrentPrice({});
            setAth({});
            setAtl({});
            setMarketCap({});
            setAvailableSupply({});
            setTotalSupply({});
            setTotalVolume({});
            setIntervalPrices({});
            setTime({});
          };
    },[id])

    const handleIntervalChange = async (e) => {
        const days = e.target.dataset.id;
        const priceDetails = await BrowseCoins.get(`/price-details/${id}/${days}`);
        const priceData = priceDetails.data.data.prices.map(el => el[1]);
        const timeData = priceDetails.data.data.prices.map(el => el[0]);
        setIntervalPrices(priceData);
        setTime(timeData);
        changePercentChange(days);
    }

    const changePercentChange = (days) => {
        console.log(days);
        if (days === '1') {
            setPercent(coinDetails.market_data.price_change_percentage_24h);
        } else if (days === '7') {
            setPercent(coinDetails.market_data.price_change_percentage_7d);
        } else if (days === '30') {
            setPercent(coinDetails.market_data.price_change_percentage_30d);
        } else if (days === '60') {
            setPercent(coinDetails.market_data.price_change_percentage_60d);
        } else if (days === '365') {
            setPercent(coinDetails.market_data.price_change_percentage_1y);
        }
    }

    const formatNumber = (price) => {

        if (price === null) price = 'Unlimited';
        else if (price > 1 ) price = price.toLocaleString();
        else if (price < 1 && price > 0.0001) price = price.toLocaleString(undefined, {minimumFractionDigits: 4});
        else price = price.toLocaleString(undefined, {minimumFractionDigits: 8});
        return price;
    }

    return (

        <div className='detail-page'>
            {loading ? <LoadingSpinner/> :
              <>
              <Titles price={currentPrice} coinDetails={coinDetails}/>
              <div className='details'>
                <Chart coinDetails={coinDetails} price={intervalPrices} time={time} changeInterval={handleIntervalChange} percent={percent}/>
                <Details price={currentPrice}
                     ath={ath} atl={atl}
                     marketCap={marketCap}
                     totalVolume={totalVolume}
                     availableSupply={availableSupply}
                     totalSupply={totalSupply}
                     coinDetails={coinDetails}/>
              </div>
              </>
            }
        </div>
    )
}

export default CoinDetails
