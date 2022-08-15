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
import {toastError} from '../utils/toasts'
import Error from '../components/Error';


const Portfolio = () => {

    const [data, setData] = useState();
    const [portfolios, setPortfolios] = useState();
    const [transactions, setTransactions] = useState([]);
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

    // form refs
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
        const controller = new AbortController()
        const retrieveData = async () => {
            try {
                const response = await PortfolioRoute.get('', {signal: controller.signal});
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
            }
        }
        retrieveData();
        return () => {controller.abort()}
    },[history, isAuthenticated, assets]);

    // Add a new transaction
    const addTransaction = async (quantity, pricePerCoin) => {
        // Unmount transaction form
        setTransactionFormDisplay(false);
        // Get uuid of asset
        const assetId = assets.filter(asset => asset.name === selectedAsset)[0].uuid;
        try {
            // Add transaction to database
            const asset = await PortfolioRoute.post('/add-transaction', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                coin_id: assetId,
                quantity,
                portfolio_id: currentPortfolio.portfolio_id,
                pricePerCoin
            });
            // Failed to authenticate 
            if (asset.data.error) {
                isAuthenticated();
                history.push('./sign-in');
            } else {
                // Find the transaction asset's coin details
                let coinDetails = assets.filter(a => a.uuid === asset.data.rows[0].asset_coin_id)[0];

                // Merge coin details with the transaction details and add to the transactions state
                coinDetails = {
                    ...asset.data.rows[0],
                    ...coinDetails
                }             
                setTransactions(prevState => prevState.concat(coinDetails));
            }
        } catch (error) {          
            console.log(error);
            toastError('Server Error! Failed to add transaction')
        }  
    } 

    // Delete an asset (delete all transactions of an asset)
    const deleteAsset = async () => {
        // Get uuid of asset and portfolio id user is deleting from
        const coin_id = selectedUserAsset.uuid;
        const portfolio_id = selectedUserAsset.portfolio_id;
        try {
            // Delete all transactions of an asset in specified portfolio from database
            const response = await PortfolioRoute.delete('/delete-asset', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                data: {
                    coin_id,
                    portfolio_id
                }
            });
            // Failed to authenticate
            if (response.data.error) {
                isAuthenticated();
                history.push('./sign-in');
            } else {
                // Create new array without deleted transactions
                let array = transactions.filter(t => {
                    return t.asset_coin_id !== coin_id || (t.asset_coin_id === coin_id && t.portfolio_id !== portfolio_id)
                });
                // Set transactions state to new array
                setTransactions(array);
            }
        } catch (error) {
            console.log(error);
            toastError('Server Error! Failed to delete asset')
            
        }
        // Unmount delete asset form
        setDeleteAssetFormDisplay(false);
    }

    // Edit transaction price per coin and/or amount
    const editTransaction = async (e, asset_amount, initial_price) => {
        e.preventDefault();
        // Get id of transaction
        const asset_id = selectedTransaction.asset_id;
        try {
            // Edit transaction in database
            const response = await PortfolioRoute.put('/edit-transaction', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                asset_amount,
                initial_price,
                asset_id
            })
            // Failed to authenticate
            if (response.data.error) {
                isAuthenticated();
                history.push('./sign-in');
            } else {
                // Create new transactions array with newly edited transaction
                const array = transactions.map(t => {
                    if (t.asset_id === asset_id) {
                        t.asset_amount = asset_amount;
                        t.initial_price = initial_price;
                    }
                    return t;
                })
                // Set transactions state to new array
                setTransactions(array);
            }
        } catch (error) {
            console.log(error);
            toastError('Server Error! Failed to edit transaction')
        }
        setEditTransactionDisplay(false);
    }

    // Delete a transaction
    const deleteTransaction = async () => {
        // Get id of transaction
        const asset_id = selectedTransaction.asset_id;
        try {
            // Delete transaction from database
            const response = await PortfolioRoute.delete('/delete-transaction', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                data: {
                    asset_id
                }
            })     
            // Failed to authenticate
            if (response.data.error) {
                isAuthenticated();
                history.push('./sign-in');
            } else {
                // Create new array without deleted transaction
                const array = transactions.filter(t => t.asset_id !== asset_id);
                // If deleted last transaction, unmount transactions table component and mount the portfolio table component
                if (!array.length) handlePortfolio()
                // Set new array to transaction state
                setTransactions(array);
            }
        } catch (error) {
            console.log(error);   
            toastError('Server Error! Failed to delete transaction')    
        }
        // Unmount delete transaction form
        setDeleteTransactionDisplay(false);
    }

    // Create a new portfolio
    const createPortfolio = async (e, name) => {
        e.preventDefault();
        // Query database with new portfolio
        try {
            const response = await PortfolioRoute.post('/create-portfolio', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                name,
                main: 'f'
            })
            // Failed to authenticate
            if (response.data.error) {
                isAuthenticated();
                history.push('./sign-in');
            // Unmount create new portfolio form and add new portfolio to portfolios state
            } else {
                setCreatePortfolioDisplay(false);
                setPortfolios(prevState => prevState.concat(response.data.rows[0]))
            }
        } catch (error) {
            console.log(error);  
            toastError('Server Error! Failed to create portfolio')
        }
    }

    // Delete a portfolio and all associated assets/transacations
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
            // Failed to authorize
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
            toastError('Server Error! Failed to delete portfolio')
            
        }
        setDeletePortfolioDisplay(false);
    }

    // Unmount portfolio table component, mount transactions table component
    // Set selectedUserAsset to the asset the user chose
    const handleTransactions = (asset) => {
        setContentDisplay(false);
        setTransactionsDisplay(true);
        setSelectedUserAsset(asset);
    }

    // Mount portfolio table component, unmount transactions table component
    const handlePortfolio = () => {
        setContentDisplay(true);
        setTransactionsDisplay(false);
    }

    // Mount edit transaction form and set the selected transation
    const handleEditTransaction = (t) => {
        setEditTransactionDisplay(true);
        setSelectedTransaction(t)
    }

    // Mount delete transaction form and set selected transaction
    const handleDeleteTransaction = (t) => {
        setDeleteTransactionDisplay(true);
        setSelectedTransaction(t);
    }

    // Mount delete portfolio form and set selected portfolio
    const handleDeletePortfolio = (p) => {
        setDeletePortfolioDisplay(true);
        setSelectedPortfolio(p);
    }

    // Unmount add new transaction form, mount the browse assets form
    const handleTrnsBackBtn = () => {
        setTransactionFormDisplay(false);
        setBrowseFormDisplay(true);
    }

    // Mount delete asset form and set selected user asset
    const selectDeleteAsset = (asset) => {
        setDeleteAssetFormDisplay(true);
        setSelectedUserAsset(asset);
    }

    // Set selectedAsset to asset user clicked on in the browse form
    // Unmount browse form, mount add transaction form
    const handleSelectAssetSubmit = (e) => {
        e.preventDefault();
        let value = e.target.dataset.asset;
        setSelectedAsset(value);
        setBrowseFormDisplay(false);
        setTransactionFormDisplay(true);  
    }

    // unmounts forms when user clicks outside form element
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
            !loading ? data && !error ?
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
            </div> :
            <Error error={'Server error. Please try again later'}></Error>
            : <></>
    )
}

export default Portfolio
