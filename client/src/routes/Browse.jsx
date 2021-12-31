import React, { useState, useEffect } from 'react';
import CoinList from '../components/browse/CoinList';
import BrowseCoins from '../apis/BrowseCoins';
import {useNavigate} from 'react-router';
import SearchCoins from '../components/browse/SearchCoins';

const Browse = () => {

    const [coins, setCoins] = useState([]);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await BrowseCoins.get('/1');
                setCoins(response.data.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    },[]);

    const handleLoadMore = async () => {
        try {
            const response = await BrowseCoins.get(`/${page + 1}`);
            setCoins(prevState => [...prevState, ...response.data.data]);
            setPage(prevState => prevState + 1);
        } catch (err) {
            console.log(err);
        }
    }

    const handleCoinSelect = (id) => {
        navigate(`/browse/${id}`);
    }

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchInput(value);  
        if (value === "") {
            setSearchResults([]);
            return;
        }
        const search = coins.filter(coin => coin.id.startsWith(value.toLowerCase()));
        setSearchResults(search);
    }

    return (
        coins && coins.length !== 0 &&
        <div className='browse-page'>   
              <SearchCoins handleSearch={handleSearch} value={searchInput} searchResults={searchResults}/>   
              <CoinList onClick={handleCoinSelect} coins={coins}/>
              <div className='load-more-btn-div'><button onClick={handleLoadMore} className='load-more-btn'>Load More</button></div>
              <div className='back-to-top-btn-div'><button onClick={() => window.location.reload()} className='back-to-top-btn'>Back to Top</button></div>
        </div>
    )
}

export default Browse
