import React, { useEffect, useState, useRef } from 'react';
import BrowseCoins from '../apis/BrowseCoins';
import { useParams } from 'react-router-dom';
import Chart from '../components/coindetails/Chart';
import Titles from '../components/coindetails/Titles';
import Details from '../components/coindetails/Details';
import '../styles/coindetails.css';
import { LoadingSpinner } from '../styles/Loading.styled';
import Error from '../components/Error';
import Summary from '../components/coindetails/Summary';

const CoinDetails = () => {

    const {id} = useParams();
    const [coinDetails, setCoinDetails] = useState();
    const [priceHistory, setPriceHistory] = useState();

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
                const coinDetailsResponse = await BrowseCoins.get(`/coin-details/${id}`);
                const priceHistoryResponse = await BrowseCoins.get(`/price-history/${id}/24h`);

                if (mountedRef.current) {      
                    setCoinDetails(coinDetailsResponse.data.data.coin);
                    setPriceHistory(priceHistoryResponse.data.data)
                    setLoading(false);
                }
            } catch (err) {
                setError(true);
                setErrorMsg(err.response.data);
                setLoading(false);
            }
        }
        fetchData();
    },[id])

    const handleTimePeriodChange = async (e) => {
        const period = e.target.dataset.id;
        const response = await BrowseCoins.get(`/price-history/${id}/${period}`);
        setPriceHistory(response.data.data);
    }

    const formatNumber = (price) => {
        price = parseFloat(price);
        if (price === null) price = 'Unlimited';
        else if (price > 1 ) price = price.toLocaleString(undefined, {maximumFractionDigits: 2});
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
                    <Titles price={1} coinDetails={coinDetails}/>
                    <div className='details'>
                        <Chart coinDetails={coinDetails}
                               priceHistory={priceHistory}
                               changeTimePeriod={handleTimePeriodChange}
                               formatNumber={formatNumber}
                        />
                        <Details coinDetails={coinDetails}
                                 formatNumber={formatNumber}
                        />
                    </div>
                    <Summary coinDetails={coinDetails} />
                </div>
                }
                </>
            }
        </>
    )
}

export default CoinDetails
