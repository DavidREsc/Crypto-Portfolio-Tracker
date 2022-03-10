import React, {useState, useContext, useEffect, useRef} from 'react';
import BrowseCoins from '../apis/BrowseCoins';
import { LoadingSpinner } from '../styles/Loading.styled';
import { useAuth } from './AuthContext';

const AssetsContext = React.createContext();

export const useAssets = () => {
    return useContext(AssetsContext);
}

export const AssetsProvider = ({children}) => {
    const [assets, setAssets] = useState();
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        }
    }, []);

    useEffect(() => {
        const fetchAssets = async () => {
            if (user) {
                setLoading(true);
                try {
                    const response = await BrowseCoins.get('/coinlist/1');
                    if (mountedRef.current) {
                        setAssets(response.data.data);
                    }
                    let coins = [];
                    for (let i = 1; i < 4; i++) {
                        const response = await BrowseCoins.get(`/coinlist/${i+1}`);
                        coins = coins.concat(response.data.data);
                    }  
                   if (mountedRef.current) {
                        setAssets(prevState => [...prevState, ...coins]); 
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            setLoading(false);
        }
        fetchAssets();
    },[user])

    const value = {
        assets
    }

    return (
        <AssetsContext.Provider value={value}>
            {loading ? user ? <div className='loading-page'><LoadingSpinner/></div> : null : children}
        </AssetsContext.Provider>
    )
}
