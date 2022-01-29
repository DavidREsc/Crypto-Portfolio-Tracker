import React, { useState, useEffect, useRef } from 'react';
import CoinList from '../components/browse/CoinList';
import BrowseCoins from '../apis/BrowseCoins';
import SearchCoins from '../components/browse/SearchCoins';
import { LoadingSpinner } from '../styles/Loading.styled';
import Error from '../components/Error';

const Browse = () => {

    const [allCoins, setAllCoins] = useState([]);
    const [limit, setLimit] = useState(100);
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
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
                const response = await BrowseCoins.get('/coinlist/1');
                if (mountedRef.current) {
                    setAllCoins(response.data.data);
                    setLoading(false);
                }
                let coins = [];
                for (let i = 1; i < 4; i++) {
                    const response = await BrowseCoins.get(`/coinlist/${i+1}`);
                    coins = coins.concat(response.data.data);
                }  
               if (mountedRef.current) {
                    setAllCoins(prevState => [...prevState, ...coins]); 
                }
            } catch (err) {
                setErrorMsg(err.response.data)
                setError(true);
                setLoading(false);
            }
        }
        fetchData();
    },[]);

    const handleLoadMore = () => {
        setLimit(prevState => prevState + 100);
    }

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchInput(value);  
        if (value === "") {
            setSearchResults([]);
            return;
        }
        const search = allCoins.filter(coin => {
            return coin.name.toLowerCase().startsWith(value.toLowerCase()) || coin.symbol.toLowerCase().startsWith(value.toLowerCase());
        })
        setSearchResults(search);
    }

    return (
        <>
            {loading ? <div className='loading-page'><LoadingSpinner /></div> : 
             <>
              {error 
                ? 
                  <Error error={errorMsg}/>
                : 
                <div className='browse-page'>  
                  <SearchCoins handleSearch={handleSearch} value={searchInput} searchResults={searchResults}/>   
                  <CoinList coins={allCoins} limit={limit}/>
                  {limit !== 1000 && <div className='load-more-btn-div'><button onClick={handleLoadMore} className='load-more-btn'>Load More</button></div>}
                  <div className='back-to-top-btn-div'><button onClick={() => window.location.reload()} className='back-to-top-btn'>Back to Top</button></div>
                </div>
              }
             </>
            }
        </>
    )
}

export default Browse
