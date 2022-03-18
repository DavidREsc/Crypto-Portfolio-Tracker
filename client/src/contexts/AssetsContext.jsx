import React, {useState, useContext, useEffect, useRef} from 'react';
import BrowseCoins from '../apis/BrowseCoins';
import { useAuth } from './AuthContext';
import {useLocation} from 'react-router-dom';
import { LoadingSpinner } from '../styles/Loading.styled';

const AssetsContext = React.createContext();

export const useAssets = () => {
    return useContext(AssetsContext);
}

export const AssetsProvider = ({children}) => {
    const location = useLocation();
    const mountedRef = useRef(false);

    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [route, setRoute] = useState({
        prevLocation: location.pathname,
        curLocation: location.pathname
    });
    const [fetchAssetsError, setFetchAssetsError] = useState(false);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        }
    }, []);

    useEffect(() => {  

        const fetchAssets = async () => { 
                try {
                    const response = await BrowseCoins.get('/coinlist'); 
                    if (mountedRef.current) {
                        setAssets(response.data.data.coins);
                        setLoading(false);
                    }              
                } catch (err) {
                    console.log(err);
                    if (mountedRef.current) setFetchAssetsError(true);
                }
        }
        fetchAssets();
    },[])

    useEffect(() => {
        if (route.prevLocation !== location.pathname) {
          setRoute((prev) => ({
              prevLocation: prev.curLocation,
              curLocation: location.pathname
          }));
        }
    }, [location, route])

    const value = {
        assets,
        fetchAssetsError
    }

    const validateAssets = (data) => {
        let vAssets = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].current_price && data[i].price_change_percentage_24h) {
                vAssets.push(data[i]);
            } 
        }
        return vAssets
    }

    return (
        <AssetsContext.Provider value={value}>
            {loading ? <div className='loading-page'><LoadingSpinner/></div> : children}
        </AssetsContext.Provider>
    )
}
