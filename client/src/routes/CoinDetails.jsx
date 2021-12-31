import React, { useEffect, useState } from 'react';
import BrowseCoins from '../apis/BrowseCoins';
import { useParams } from 'react-router-dom';
import Chart from '../components/coindetails/Chart';
import Titles from '../components/coindetails/Titles';
import Details from '../components/coindetails/Details';
import '../styles/coindetails.css';


const CoinDetails = () => {

    const {id} = useParams();
    const [intervalPrices, setIntervalPrices] = useState([]);
    const [time, setTime] = useState([]);
    const [coinDetails, setCoinDetails] = useState([]);
    const [currentPrice, setCurrentPrice] = useState("");
    const [ath, setAth] = useState("");
    const [atl, setAtl] = useState("");
    const [marketCap, setMarketCap] = useState("");
    const [totalVolume, setTotalVolume] = useState("");
    const [availableSupply, setAvailableSupply] = useState("");
    const [totalSupply, setTotalSupply] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coinDetails = await BrowseCoins.get(`/coin-details/${id}`);
                setCoinDetails(coinDetails.data.data);
                setCurrentPrice(formatNumber(coinDetails.data.data.market_data.current_price.cad));
                setAth(formatNumber(coinDetails.data.data.market_data.ath.cad));
                setAtl(formatNumber(coinDetails.data.data.market_data.atl.cad));
                setMarketCap(formatNumber(coinDetails.data.data.market_data.market_cap.cad))
                setAvailableSupply(formatNumber(coinDetails.data.data.market_data.circulating_supply));
                setTotalSupply(formatNumber(coinDetails.data.data.market_data.max_supply));
                setTotalVolume(formatNumber(coinDetails.data.data.market_data.total_volume.cad));
                console.log(coinDetails)

                const priceDetails = await BrowseCoins.get(`/price-details/${id}/1`);
                const priceData = priceDetails.data.data.prices.map(el => el[1]);
                const timeData = priceDetails.data.data.prices.map(el => el[0]);
                setIntervalPrices(priceData);
                setTime(timeData);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    },[id])

    const handleIntervalChange = async (e) => {
        const days = e.target.dataset.id;
        const priceDetails = await BrowseCoins.get(`/price-details/${id}/${days}`);
        const priceData = priceDetails.data.data.prices.map(el => el[1]);
        const timeData = priceDetails.data.data.prices.map(el => el[0]);
        setIntervalPrices(priceData);
        setTime(timeData);
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
            <Titles price={currentPrice} coinDetails={coinDetails}/>
            <div className='details'>
              <Chart price={intervalPrices} time={time} changeInterval={handleIntervalChange}/>
              <Details price={currentPrice}
                     ath={ath} atl={atl}
                     marketCap={marketCap}
                     totalVolume={totalVolume}
                     availableSupply={availableSupply}
                     totalSupply={totalSupply}
                     coinDetails={coinDetails}/>
            </div>
        </div>
    )
}

export default CoinDetails
