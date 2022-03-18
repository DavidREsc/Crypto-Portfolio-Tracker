import React, { useState, useEffect, useRef } from 'react';
import CoinList from '../components/browse/CoinList';
import SearchCoins from '../components/browse/SearchCoins';
import { useAssets } from '../contexts/AssetsContext';

const Browse = () => {

    const [limit, setLimit] = useState(100);
  
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const mountedRef = useRef(false);
    const {assets} = useAssets();

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        }
    }, []);

  
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
        const search = assets.filter(coin => {
            return coin.name.toLowerCase().startsWith(value.toLowerCase()) || coin.symbol.toLowerCase().startsWith(value.toLowerCase());
        })
        setSearchResults(search);
    }

    return (
        <>
           
                <div className='browse-page'>  
                  <SearchCoins handleSearch={handleSearch} value={searchInput} searchResults={searchResults}/>   
                  <CoinList limit={limit}/>
                  {limit !== 1000 && <div className='load-more-btn-div'><button onClick={handleLoadMore} className='load-more-btn'>Load More</button></div>}
                  <div className='back-to-top-btn-div'><button onClick={() => window.location.reload()} className='back-to-top-btn'>Back to Top</button></div>
                </div>
                     
        </>
    )
}

export default Browse
