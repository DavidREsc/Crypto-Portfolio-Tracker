import React, { useEffect, useState } from 'react';
import BrowseCoins from '../apis/BrowseCoins';
import { useParams } from 'react-router-dom';
import Chart from '../components/coindetails/Chart';
import '../styles/coindetails.css';


const CoinDetails = () => {

    const {id} = useParams();
    const [price, setPrice] = useState([]);
    const [time, setTime] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await BrowseCoins.get(`/details/${id}`);
                const priceData = response.data.data.prices.map(el => el[1]);
                const timeData = response.data.data.prices.map(el => el[0]);
                setPrice(priceData);
                setTime(timeData);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    },[id])

    return (
        <div className='detail-page'>
            <div>
                <Chart price={price} time={time}/>
            </div>
        </div>
    )
}

export default CoinDetails
