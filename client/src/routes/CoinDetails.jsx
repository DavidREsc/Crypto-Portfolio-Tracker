import React, { useEffect, useState } from 'react';
import BrowseCoins from '../apis/BrowseCoins';
import { useParams } from 'react-router-dom';
import Chart from '../components/coindetails/Chart';
import Titles from '../components/coindetails/Titles';
import '../styles/coindetails.css';


const CoinDetails = () => {

    const {id} = useParams();
    const [intervalPrices, setIntervalPrices] = useState([]);
    const [time, setTime] = useState([]);
    const [coinDetails, setCoinDetails] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coinDetails = await BrowseCoins.get(`/coin-details/${id}`);
                setCoinDetails(coinDetails.data.data);

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

    return (
        <div className='detail-page'>
            <Titles coinDetails={coinDetails}/>
            <Chart price={intervalPrices} time={time}/>

        </div>
    )
}

export default CoinDetails
