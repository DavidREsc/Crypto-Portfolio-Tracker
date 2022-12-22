import React, { useEffect, useState, useRef } from 'react';
import Coins from '../apis/Coins';
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
                const coinDetailsResponse = await Coins.get(`/${id}`);
                const priceHistoryResponse = await Coins.get(`/${id}/24h`);
                if (mountedRef.current) {
                    if (coinDetailsResponse.data.data.status === 'fail' || priceHistoryResponse.data.data.status === 'fail') {
                        setError(true);
                        setErrorMsg(coinDetailsResponse.data.data.message);
                        setLoading(false);
                    }
                    else {      
                        setCoinDetails(coinDetailsResponse.data.data.data.coin);
                        setPriceHistory(priceHistoryResponse.data.data.data)
                        setLoading(false);
                    }
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
        const response = await Coins.get(`/${id}/${period}`);
        setPriceHistory(response.data.data.data);
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
                        />
                        <Details coinDetails={coinDetails}/>
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
