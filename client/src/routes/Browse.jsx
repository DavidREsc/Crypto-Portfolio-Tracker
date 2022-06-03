import React, { useState, useEffect, useRef } from 'react';
import CoinList from '../components/browse/CoinList';
import SearchCoins from '../components/browse/SearchCoins';

const Browse = () => {

    const [limit, setLimit] = useState(100);
    const [searchFormDisplay, setSearchFormDisplay] = useState(false);
    const mountedRef = useRef(false);
    const searchFormRef = useRef(null);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', unmountForm);
    });

    const handleLoadMore = () => {
        setLimit(prevState => prevState + 100);
    }

    const unmountForm = (e) => {
        if (searchFormRef.current && !searchFormRef.current.contains(e.target)) {
            setSearchFormDisplay(false);
        }
    }

    return (
        <>      
            <div className='browse-page'> 
                <button className='search-form-btn'onClick={() => setSearchFormDisplay(true)}>Search...
                </button>
                {searchFormDisplay && <SearchCoins
                  reference={searchFormRef}
                  closeForm={() => setSearchFormDisplay(false)}
                />}         
                <CoinList limit={limit}/>
                {limit !== 1000 && <div className='load-more-btn-div'><button onClick={handleLoadMore} className='load-more-btn'>Load More</button></div>}
                <div className='back-to-top-btn-div'><button onClick={() => window.location.reload()} className='back-to-top-btn'>Back to Top</button></div>
            </div>
                     
        </>
    )
}

export default Browse
