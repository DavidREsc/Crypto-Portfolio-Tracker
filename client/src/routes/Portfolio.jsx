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
import DeleteAssetForm from '../components/portfolio/DeleteAssetForm';
import Transactions from '../components/portfolio/Transactions';
import EditTransactionForm from '../components/portfolio/EditTransactionForm';
import DeleteTransactionForm from '../components/portfolio/DeleteTransactionForm';
import CreatePortfolioForm from '../components/portfolio/CreatePortfolioForm';
import DeletePortfolioForm from '../components/portfolio/DeletePortfolioForm';

const Portfolio = () => {

    const [data, setData] = useState();
    const [portfolios, setPortfolios] = useState();
    const [transactions, setTransactions] = useState();
    const [loading, setLoading] = useState(true);
    const [browseFormDisplay, setBrowseFormDisplay] = useState(false);
    const [transactionFormDisplay, setTransactionFormDisplay] = useState(false);
    const [deleteAssetFormDisplay, setDeleteAssetFormDisplay] = useState(false);
    const {assets} = useAssets();
    const history = useHistory();
    const {isAuthenticated} = useAuth();
    const [selectedAsset, setSelectedAsset] = useState("");
    const [selectedUserAsset, setSelectedUserAsset] = useState();
    const [selectedTransaction, setSelectedTransaction] = useState();
    const [selectedPortfolio, setSelectedPortfolio] = useState();
    const [currentPortfolio, setCurrentPortfolio] = useState()
    const [contentDisplay, setContentDisplay] = useState(true);
    const [transactionsDisplay, setTransactionsDisplay] = useState(false);
    const [editTransactionDisplay, setEditTransactionDisplay] = useState(false);
    const [deleteTransactionDisplay, setDeleteTransactionDisplay] = useState(false);
    const [createPortfolioDisplay, setCreatePortfolioDisplay] = useState(false);
    const [deletePortfolioDisplay, setDeletePortfolioDisplay] = useState(false);
    const [error, setError] = useState(false);

    const dropDownRef = useRef(null);
    const transactionFormRef = useRef(null);
    const deleteFormRef = useRef(null);
    const editFormRef = useRef(null);
    const deleteTransactionFormRef = useRef(null);
    const createPortfolioFormRef = useRef(null);
    const deletePortfolioFormRef = useRef(null);
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
                    // merge user transactions with coin details
                    let array = response.data.assets.map(data => {
                        let asset = assets.filter(asset => data.asset_coin_id === asset.uuid)[0];
                        return {
                            ...data,
                            ...asset
                        }
                    })
                    if (mountedRef.current) {
                        setData(response.data);
                        setPortfolios(response.data.portfolios);
                        setTransactions(array);
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
        retrieveData();
    },[history, isAuthenticated, assets]);

    const addTransaction = async (quantity, pricePerCoin) => {
        setTransactionFormDisplay(false);
        const assetId = assets.filter(asset => asset.name === selectedAsset)[0].uuid;
        try {
            const asset = await PortfolioRoute.post('/add-transaction', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                coin_id: assetId,
                quantity,
                portfolio_id: currentPortfolio.portfolio_id,
                pricePerCoin
            });
            if (asset.data.error) {
                isAuthenticated();
                history.push('./sign-in');
            } else {
                let transaction = assets.filter(a => a.uuid === asset.data.rows[0].asset_coin_id)[0];
                transaction = {
                    ...asset.data.rows[0],
                    ...transaction
                }             
                setTransactions(prevState => prevState.concat(transaction));
            }
        } catch (error) {          
            console.log(error);
        }  
    } 

    const deleteAsset = async () => {
        const coin_id = selectedUserAsset.uuid;
        const portfolio_id = selectedUserAsset.portfolio_id;
        try {
            const response = await PortfolioRoute.delete('/delete-asset', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                data: {
                    coin_id,
                    portfolio_id
                }
            });
            if (response.data.error) {
                isAuthenticated();
                history.push('./sign-in');
            } else {
                let array = transactions.filter(t => {
                    return t.asset_coin_id !== coin_id || (t.asset_coin_id === coin_id && t.portfolio_id !== portfolio_id)
                });
                setTransactions(array);
            }
        } catch (error) {
            console.log(error);
            
        }
        setDeleteAssetFormDisplay(false);
    }

    const editTransaction = async (e, asset_amount, initial_price) => {
        e.preventDefault();
        const asset_id = selectedTransaction.asset_id;
        try {
            const response = await PortfolioRoute.put('/edit-transaction', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                asset_amount,
                initial_price,
                asset_id
            })
            if (response.data.error) {
                isAuthenticated();
                history.push('./sign-in');
            } else {
                const array = transactions.map(t => {
                    if (t.asset_id === asset_id) {
                        t.asset_amount = asset_amount;
                        t.initial_price = initial_price;
                    }
                    return t;
                })
                setTransactions(array);
                setEditTransactionDisplay(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteTransaction = async () => {
        const asset_id = selectedTransaction.asset_id;
        try {
            const response = await PortfolioRoute.delete('/delete-transaction', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                data: {
                    asset_id
                }
            })     
            if (response.data.error) {
                isAuthenticated();
                history.push('./sign-in');
            } else {
                const array = transactions.filter(t => t.asset_id !== asset_id);
                if (!array.length) handlePortfolio();
                setTransactions(array);
                setDeleteTransactionDisplay(false);
            }
        } catch (error) {
            console.log(error);       
        }
    }

    const createPortfolio = async (e, name) => {
        e.preventDefault();
        try {
            const response = await PortfolioRoute.post('/create-portfolio', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                name,
                main: 'f'
            })
            if (response.data.error) {
                isAuthenticated();
                history.push('./sign-in');
            } else {
                setCreatePortfolioDisplay(false);
                setPortfolios(prevState => prevState.concat(response.data.rows[0]))
            }
        } catch (error) {
            console.log(error);  
        }
    }

    const deletePortfolio = async () => {
        const portfolio_id = selectedPortfolio.portfolio_id;
        try {
            const response = await PortfolioRoute.delete('/delete-portfolio', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                data: {
                    portfolio_id
                }
            })
            if (response.data.error) {
                isAuthenticated();
                history.push('./sign-in');
            } else {
                setTransactions(transactions.filter(t => t.portfolio_id !== portfolio_id));
                setPortfolios(portfolios.filter(p => p.portfolio_id !== portfolio_id));
                setCurrentPortfolio(portfolios[0]);
            }
        } catch (error) {
            console.log("error");
            
        }
        setDeletePortfolioDisplay(false);
    }

    const handleTransactions = (asset) => {
        setContentDisplay(false);
        setTransactionsDisplay(true);
        setSelectedUserAsset(asset);
    }

    const handlePortfolio = () => {
        setContentDisplay(true);
        setTransactionsDisplay(false);
    }

    const handleEditTransaction = (t) => {
        setEditTransactionDisplay(true);
        setSelectedTransaction(t)
    }

    const handleDeleteTransaction = (t) => {
        setDeleteTransactionDisplay(true);
        setSelectedTransaction(t);
    }

    const handleDeletePortfolio = (p) => {
        setDeletePortfolioDisplay(true);
        setSelectedPortfolio(p);
    }

    const handleTrnsBackBtn = () => {
        setTransactionFormDisplay(false);
        setBrowseFormDisplay(true);
    }

    const selectDeleteAsset = (asset) => {
        setDeleteAssetFormDisplay(true);
        setSelectedUserAsset(asset);
    }

    const handleSelectAssetSubmit = (e) => {
        e.preventDefault();
        let value = e.target.dataset.asset;
        setSelectedAsset(value);
        setBrowseFormDisplay(false);
        setTransactionFormDisplay(true);  
    }

    // unmounts form when user clicks outside form element
    const unmountForm = (e) => {
        if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
                setBrowseFormDisplay(false);
        } else if (transactionFormRef.current && !transactionFormRef.current.contains(e.target)) {
                setTransactionFormDisplay(false);
        } else if (deleteFormRef.current && !deleteFormRef.current.contains(e.target)) {
                setDeleteAssetFormDisplay(false);
        } else if (editFormRef.current && !editFormRef.current.contains(e.target)) {
                setEditTransactionDisplay(false);
        } else if (deleteTransactionFormRef.current && !deleteTransactionFormRef.current.contains(e.target)) {
                setDeleteTransactionDisplay(false);
        } else if (createPortfolioFormRef.current && !createPortfolioFormRef.current.contains(e.target)) {
                setCreatePortfolioDisplay(false);
        } else if (deletePortfolioFormRef.current && !deletePortfolioFormRef.current.contains(e.target)) {
                setDeletePortfolioDisplay(false);
        }
    }


    return (
            !loading && data && !error &&
            <div className='portfolio-page'>
                <div className='portfolio-page-content'>
                    {browseFormDisplay &&
                    <BrowseForm 
                      handleSubmit={handleSelectAssetSubmit}
                      reference={dropDownRef}
                      closeForm={() => setBrowseFormDisplay(false)}
                    />}
                    {transactionFormDisplay &&
                    <TransactionForm style={transactionFormDisplay} reference={transactionFormRef}
                      selectedAsset={selectedAsset}
                      addTransaction={addTransaction}
                      handleTrnsBackBtn={handleTrnsBackBtn}
                      closeForm={() => setTransactionFormDisplay(false)}
                    />}
                    {deleteAssetFormDisplay &&
                    <DeleteAssetForm style={deleteAssetFormDisplay} reference={deleteFormRef}
                        userAsset={selectedUserAsset}
                        deleteAsset={deleteAsset}
                        closeForm={() => setDeleteAssetFormDisplay(false)}
                        selectedAsset={selectedUserAsset}
                    />}
                    <Sidebar data={portfolios} handleCreatePortfolio={() => setCreatePortfolioDisplay(true)}
                      selectPortfolio={(p) =>  {
                          setCurrentPortfolio(p)
                          handlePortfolio()
                        }}
                      handleDeletePortfolio={handleDeletePortfolio}
                    />
                    {contentDisplay && <Content 
                        handleAddAsset={() => setBrowseFormDisplay(true)}
                        handleDeleteAsset={selectDeleteAsset}
                        handleTransactions={handleTransactions}
                        transactions={transactions}
                        currentPortfolio={currentPortfolio}
                    />}
                    {transactionsDisplay && 
                      <Transactions
                        handlePortfolio={handlePortfolio}
                        allTransactions={transactions}
                        selectedUserAsset={selectedUserAsset}
                        handleEditTransaction={handleEditTransaction}
                        handleDeleteTransaction={handleDeleteTransaction}
                      />
                    }
                    {editTransactionDisplay && <EditTransactionForm
                      transaction={selectedTransaction}
                      reference={editFormRef}
                      handleSubmit={editTransaction}
                      closeForm={() => setEditTransactionDisplay(false)}
                    />}
                    {deleteTransactionDisplay && <DeleteTransactionForm
                      reference={deleteTransactionFormRef} 
                      closeForm={() => setDeleteTransactionDisplay(false)}
                      deleteTransaction={deleteTransaction}
                    />}
                    {createPortfolioDisplay && <CreatePortfolioForm
                      reference={createPortfolioFormRef}
                      createPortfolio={createPortfolio}
                      closeForm={() => setCreatePortfolioDisplay(false)}
                    />}
                    {deletePortfolioDisplay && <DeletePortfolioForm
                      reference={deletePortfolioFormRef}
                      deletePortfolio={deletePortfolio}
                      closeForm={() => setDeletePortfolioDisplay(false)}
                    />}
                </div>
            </div>
    )
}

export default Portfolio
