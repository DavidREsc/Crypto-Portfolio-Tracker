import React, {useState, useContext, useEffect, useRef} from 'react';
import Coins from '../apis/Coins';
import { LoadingSpinner } from '../styles/Loading.styled';
import Error from '../components/Error';

const AssetsContext = React.createContext();

export const useAssets = () => {
    return useContext(AssetsContext);
}

export const AssetsProvider = ({children}) => {
    const mountedRef = useRef(false);

    const [assets, setAssets] = useState([]);
    const [stats, setStats] = useState();
    const [loading, setLoading] = useState(true);
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
                    const response = await Coins.get('/'); 
                    if (mountedRef.current) {
                        setAssets(response.data.data.coins);
                        setStats(response.data.data.stats);
                        setLoading(false);
                    }              
                } catch (err) {
                    console.log(err);
                    if (mountedRef.current) {
                        setFetchAssetsError(true)
                        setLoading(false)
                    }
                }
        }
        fetchAssets()
        setInterval(fetchAssets, 180000)
    },[])

    const value = {
        assets,
        stats,
        fetchAssetsError
    }

    return (
        <AssetsContext.Provider value={value}>
            {loading ? <div className='loading-page'><LoadingSpinner/></div> : fetchAssetsError ? <Error error={'Server error'}/> : children}
        </AssetsContext.Provider>
    )
}
