import React, {createContext, useContext, useEffect, useRef, useState} from 'react'
import { useAssets } from './AssetsContext';
import { useAuth } from './AuthContext';
import { LoadingSpinner } from '../styles/Loading.styled';
import PortfolioRoute from '../apis/PortfolioRoute';
import Error from '../components/Error';
import {useHistory} from 'react-router-dom';
import Map from '../utils/Map';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  return useContext(PortfolioContext);
}

export const PortfolioProvider = ({children}) => {

  const [portfolios, setPortfolios] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentPortfolio, setCurrentPortfolio] = useState()
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState({})
  const [map, setMap] = useState({})
  const [capitalGains, setCapitalGains] = useState()

  const mountedRef = useRef(false);
  const {assets} = useAssets()
	const {isAuthenticated} = useAuth();
	const history = useHistory();



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
            let asset = assets.filter(asset => data.asset_id === asset.uuid)[0];
            return {
              ...data,
              ...asset
            }
          })
          if (mountedRef.current) {
            setPortfolios(response.data.portfolios);
            setTransactions(array);
            const lastPortfolio = localStorage.getItem('lastPortfolioViewed')
            let selectPortfolio;
            if (!lastPortfolio) selectPortfolio = response.data.portfolios.filter(p => p.portfolio_name === 'Main')[0];
            else selectPortfolio = response.data.portfolios.filter(p => p.portfolio_id === lastPortfolio)[0]
            const map = new Map()
            let profit = 0
            for (let i = 0; i < array.length; i++) {
              if (array[i].portfolio_id === selectPortfolio.portfolio_id && array[i].transaction_type === 'buy') {
                map.set(array[i].name, {amount: array[i].asset_amount, price: array[i].initial_price})
              }
            }
            for (let i = 0; i < array.length; i++) {
              if (array[i].portfolio_id === selectPortfolio.portfolio_id && array[i].transaction_type === 'sell') {
                profit += map.sell(array[i].name, {amount: array[i].asset_amount, price: array[i].initial_price})
              }
            }
            setMap(map)
            setCapitalGains(profit.toFixed(2))
            setCurrentPortfolio(selectPortfolio)
            setLoading(false)
          }
        }
      } catch (error) {
        if (mountedRef.current) {
          console.log(error)
          setLoading(false)
          setError(true);
        }
      }
    }
    retrieveData();
    return () => {controller.abort()}
    }, [history, isAuthenticated, assets]);

  

	const updateSelected = (selected) => {
    setSelected(selected)
	}

  const createMap = (p, transactions) => {
    const map = new Map()
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].portfolio_id === p.portfolio_id && transactions[i].transaction_type === 'buy') {
        map.set(transactions[i].name, {amount: transactions[i].asset_amount, price: transactions[i].initial_price})
      }
    }
    updateCapitalGains(map, p, transactions)
    setMap(map)
  }

  const updateCapitalGains = (m, p, transactions) => {
    let profit = 0
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].portfolio_id === p.portfolio_id && transactions[i].transaction_type === 'sell') {
        profit += m.sell(transactions[i].name, {amount: transactions[i].asset_amount, price: transactions[i].initial_price})
      }
    }
    setCapitalGains(profit.toFixed(2))
  }

  const sellTransaction = () => {
    //manage.print('Ethereum')
  }

  const updateCurrentPortfolio = (p) => {
    setCurrentPortfolio(p)
    localStorage.setItem('lastPortfolioViewed', p.portfolio_id)
    createMap(p, transactions)
  }

	// Delete an asset (delete all transactions of an asset)
	const deleteAsset = async (cb) => {
	  // Get uuid of asset and portfolio id user is deleting from
		const coin_id = selected.uuid;
		const portfolio_id = selected.portfolio_id;
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
					return t.asset_id !== coin_id || (t.asset_id === coin_id && t.portfolio_id !== portfolio_id)
				});
				// Set transactions state to new array
				setTransactions(array);
        createMap(currentPortfolio, array)
				cb()
			}
		} catch (error) {
			cb(error)
		}
	}

  // Add a new transaction
  const addTransaction = async (quantity, pricePerCoin, type, date, cb) => {
    // Get uuid of asset
    const assetId = selected.uuid
    try {
      // Add transaction to database
      const asset = await PortfolioRoute.post('/add-transaction', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        coin_id: assetId,
        quantity,
        portfolio_id: currentPortfolio.portfolio_id,
        pricePerCoin,
        type,
        date
      });
      // Failed to authenticate 
      if (asset.data.error) {
        isAuthenticated();
        history.push('./sign-in');
      } else {
        // Find the transaction asset's coin details
        let coinDetails = assets.filter(a => a.uuid === asset.data.rows[0].asset_id)[0];

        // Merge coin details with the transaction details and add to the transactions state
        coinDetails = {
          ...asset.data.rows[0],
          ...coinDetails
        }             
        let array = transactions.concat(coinDetails)
        array.sort(function(a,b){
          return new Date(a.transaction_date) - new Date(b.transaction_date)
        })
        setTransactions(array);
        createMap(currentPortfolio, array)
        cb()
      }
    } catch (e) { 
      cb(e)         
    }  
  } 

  // Delete a transaction
  const deleteTransaction = async (cb) => {
    // Get id of transaction
    const transaction_id = selected.transaction_id;
    try {
        // Delete transaction from database
        const response = await PortfolioRoute.delete('/delete-transaction', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            data: {
                transaction_id
            }
        })     
        // Failed to authenticate
        if (response.data.error) {
            isAuthenticated();
            history.push('./sign-in');
        } else {
            // Create new array without deleted transaction
            const arr = transactions.filter(t => t.transaction_id !== transaction_id)
            if (!arr.length) setTransactions([arr])
            else setTransactions(arr)
            createMap(currentPortfolio, arr)
            cb()
        }
    } catch (e) {
      cb(e)   
    }
  }

   // Edit transaction price per coin and/or amount
   const editTransaction = async (quantity, pricePerCoin, cb) => {
    // Get id of transaction
    const transaction_id = selected.transaction_id;
    try {
        // Edit transaction in database
        const response = await PortfolioRoute.put('/edit-transaction', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            quantity,
            pricePerCoin,
            transaction_id
        })
        // Failed to authenticate
        if (response.data.error) {
            isAuthenticated();
            history.push('./sign-in');
        } else {
            // Create new transactions array with newly edited transaction
            const array = transactions.map(t => {
                if (t.transaction_id === transaction_id) {
                    t.asset_amount = quantity;
                    t.initial_price = pricePerCoin;
                }
                return t;
            })
            // Set transactions state to new array
            setTransactions(array);
            createMap(currentPortfolio, array)
            cb()
        }
    } catch (e) {
      cb(e)  
    }
  }

   // Delete a portfolio and all associated assets/transacations
   const deletePortfolio = async (p, cb) => {
    const portfolio_id = p.portfolio_id;
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
            if (portfolio_id === currentPortfolio.portfolio_id) {
              updateCurrentPortfolio(portfolios[0]);
              createMap(portfolios[0], transactions)
            }
            cb()
        }
    } catch (e) {
        cb(e)
    }
  }

  // Create a new portfolio
  const createPortfolio = async (name, cb, main = 'f') => {
        // Query database with new portfolio
        try {
            const response = await PortfolioRoute.post('/create-portfolio', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                name,
                main
            })
            // Failed to authenticate
            if (response.data.error) {
                isAuthenticated();
                history.push('./sign-in');
            // Unmount create new portfolio form and add new portfolio to portfolios state
            } else {
                if (!portfolios.length) updateCurrentPortfolio(response.data.rows[0])
                setPortfolios(prevState => prevState.concat(response.data.rows[0]))
                cb()
            }
        } catch (e) {
            cb(e)
        }
    }

    const value = {
			portfolios,
			transactions,
			currentPortfolio,
      selected,
      map,
      capitalGains,
			updateSelected,
      updateCurrentPortfolio,
			deleteAsset,
      addTransaction,
      deleteTransaction,
      editTransaction,
      deletePortfolio,
      createPortfolio,
      sellTransaction
    }

    return (
      <PortfolioContext.Provider value={value}>
        {loading || !portfolios || !transactions ? 
        <div className='loading-page'><LoadingSpinner/></div> 
					: error ? 
						<Error error={'Server error'}/> 
						: children}
      </PortfolioContext.Provider>
    )
}