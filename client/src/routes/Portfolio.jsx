import React, {useEffect, useState, useRef} from 'react';
import '../styles/portfolio.css';
import PortfolioRoute from '../apis/PortfolioRoute';
import Sidebar from '../components/portfolio/Sidebar';
import Content from '../components/portfolio/Content';
import BrowseForm from '../components/portfolio/BrowseForm';
import TransactionForm from '../components/portfolio/TransactionForm';
import { useAssets } from '../contexts/AssetsContext';
import {useHistory} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Portfolio = () => {

    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [browseFormDisplay, setBrowseFormDisplay] = useState(false);
    const [transactionFormDisplay, setTransactionFormDisplay] = useState(false);
    const {assets} = useAssets();
    const history = useHistory();
    const {isAuthenticated} = useAuth();
    const [selectedAsset, setSelectedAsset] = useState("");
    const [currentPortfolio, setCurrentPortfolio] = useState()
    const [error, setError] = useState(false);

    const dropDownRef = useRef(null);
    const transactionFormRef = useRef(null);
    const mountedRef = useRef(false);
    
    useEffect(() => {
        document.addEventListener('mousedown', unmountForm);
    });

    // ref that keeps track of when component unmounts
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        }
    }, []);

    // retrieve user portfolios and assets
    useEffect(() => {
        const retrieveData = async () => {
            try {
                const response = await PortfolioRoute.get('');
                // jwt token expired
                if (response.data.error) {
                    isAuthenticated();
                    history.push('./sign-in');
                }
                else {
                    if (mountedRef.current) {
                        setData(response.data);
                        setCurrentPortfolio(response.data.portfolios[0]);
                        setLoading(false)
                    }
                }
            } catch (error) {
                if (mountedRef.current) {
                     setLoading(false)
                     setError(true);
                }
                console.log(error.response)
            }
        }
        console.log(assets)
        retrieveData();
    },[history, isAuthenticated, assets]);


    // unmounts form when user clicks outside form element
    const unmountForm = (e) => {
        if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
            setBrowseFormDisplay(false);
        }
        if (transactionFormRef.current && !transactionFormRef.current.contains(e.target)) {
            setTransactionFormDisplay(false);
        }
    }

    const handleAddAsset = async () => {
        setBrowseFormDisplay(true);
    }

    const handleSelectAssetSubmit = (e) => {
        e.preventDefault();
        let value = e.target.dataset.asset;
        setSelectedAsset(value);
        setBrowseFormDisplay(false);
        setTransactionFormDisplay(true);  
    }

    const addTransaction = async (quantity, pricePerCoin) => {
        setTransactionFormDisplay(false);
        const assetId = assets.filter(asset => asset.name === selectedAsset)[0].uuid;
        try {
            const asset = await PortfolioRoute.post('/add-transaction', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                coin_id: assetId,
                quantity: quantity,
                portfolio_id: currentPortfolio.portfolio_id,
                pricePerCoin: pricePerCoin
            });
            setData(prevState => ({
                ...prevState,
                assets: [...prevState.assets, asset.data.rows[0]]
            }));
        } catch (error) {
            console.log(error);
        }  
    } 

    return (
        <div className='portfolio-page'>
            {!loading && !error && data &&
                <div className='portfolio-page-content'>
                    {browseFormDisplay &&
                    <BrowseForm 
                      handleSubmit={handleSelectAssetSubmit}
                      reference={dropDownRef}
                    />}
                    {transactionFormDisplay &&
                    <TransactionForm style={transactionFormDisplay} reference={transactionFormRef}
                      selectedAsset={selectedAsset}
                      addTransaction={addTransaction}
                    />}
                    <Sidebar data={data}/>
                    <Content handleAddAsset={handleAddAsset} data={data.assets}/>          
                </div>
            }
        </div>
    )
}

export default Portfolio
