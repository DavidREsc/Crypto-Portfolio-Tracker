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

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [browseFormDisplay, setBrowseFormDisplay] = useState(false);
    const [transactionFormDisplay, setTransactionFormDisplay] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const {assets} = useAssets();
    const history = useHistory();
    const {isAuthenticated} = useAuth();
    const [selectedAsset, setSelectedAsset] = useState("");

    const dropDownRef = useRef(null);
    const transactionFormRef = useRef(null);
    const mountedRef = useRef(false);
    
    useEffect(() => {
        document.addEventListener('mousedown', closeDropDown);
    });

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        }
    }, []);

    useEffect(() => {
        const retrieveData = async () => {
            try {
                console.log(assets)
                const response = await PortfolioRoute.get('');
                if (response.data.error) {
                    isAuthenticated();
                    history.push('./sign-in');
                }
                else {
                    if (mountedRef.current) {
                        setData(response.data.portfolios);
                    }
                    else return null;
                }
            } catch (error) {
                console.log(error.response)
            }
            setLoading(false);
        }
        retrieveData();
    },[assets, history, isAuthenticated]);

    const closeDropDown = (e) => {
        if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
            setBrowseFormDisplay(false);
        }
        if (transactionFormRef.current && !transactionFormRef.current.contains(e.target)) {
            setTransactionFormDisplay(false);
        }
    }

    const handleSearchTerm = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
    }

    const handleAddAsset = async () => {
        setBrowseFormDisplay(true);

        /*try {
            const asset = await PortfolioRoute.post('/add-asset', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                coin_id: 'bitcoin',
                amount: 1,
                portfolio_id: 'cc1aa605-0782-4f65-b85f-2aabc69a4551',
                initial_price: 52300
            });
            console.log(asset)
            console.log(assets);
        } catch (error) {
            console.log(error);
        }*/
    }

    const handleAddAssetSubmit = async (e) => {
        e.preventDefault();
        let value = e.target.dataset.asset;
        setSelectedAsset(value);
        setBrowseFormDisplay(false);
        setSearchTerm("");
        setTransactionFormDisplay(true);  
    }

    return (
        <div className='portfolio-page'>
            {!loading && data &&
                <div className='portfolio-page-content'>
                    {browseFormDisplay &&
                    <BrowseForm 
                      handleSubmit={handleAddAssetSubmit}
                      handleSearchTerm={handleSearchTerm}
                      searchTerm={searchTerm}
                      reference={dropDownRef}
                    />}
                    {transactionFormDisplay &&
                    <TransactionForm style={transactionFormDisplay} reference={transactionFormRef}
                      selectedAsset={selectedAsset}
                    />}
                    <Sidebar data={data}/>
                    <Content handleAddAsset={handleAddAsset} data={data}/>          
                </div>
            }
        </div>
    )
}

export default Portfolio
