import React, {createContext, useContext, useEffect, useRef, useState, useCallback} from 'react'
import { useAssets } from './AssetsContext';
import { useAuth } from './AuthContext';
import { LoadingSpinner } from '../styles/Loading.styled';
import Portfolios from '../apis/Portfolios';
import Transactions from '../apis/Transactions';
import Error from '../components/Error';
import {useHistory} from 'react-router-dom';
import Map from '../utils/Map';
import formatData from '../utils/formatData'

const PortfolioContext = createContext();

export const usePortfolio = () => {
  return useContext(PortfolioContext);
}

export const PortfolioProvider = ({children}) => {
  const [portfolios, setPortfolios] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentPortfolio, setCurrentPortfolio] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const [map, setMap] = useState({});
  const [capitalGains, setCapitalGains] = useState();

  const mountedRef = useRef(false);
  const { assets } = useAssets();
  const { isAuthenticated } = useAuth();
  const history = useHistory();

  // Calculates capital gains for current portfolio
  const calculateCapitalGains = useCallback((map, sellTransactions) => {
    let capitalGains = 0;
    sellTransactions.forEach((transaction) => {
      capitalGains += map.sell(transaction.name, {
        amount: transaction.asset_amount,
        price: transaction.initial_price,
        date: transaction.transaction_date,
      });
    });
    setCapitalGains(capitalGains.toFixed(2));
  }, []);

  // Creates a hashmap of queues for buy transactions in current portfolio
  const createBuyTransactionMap = useCallback(
    (portfolioId, transactions) => {
      const map = new Map();
      const sellTransactions = [];
      transactions.forEach((transaction) => {
        if (transaction.portfolio_id === portfolioId) {
          // check that transaction is in current portfolio
          if (transaction.transaction_type === "buy") {

            /* Attach 'amount_sold' property to transaction and initialize to zero. 
            Used to display correct quantity of asset in the asset table */
            transaction.amount_sold = 0; 
            map.set(transaction.name, {
              amount: transaction.asset_amount,
              price: transaction.initial_price,
              t: transaction,
            });
          } else if (transaction.transaction_type === "sell") {
            sellTransactions.push(transaction); // store sell transactions in separate array
          }
        }
      });
      calculateCapitalGains(map, sellTransactions);
      setMap(map);
    },
    [calculateCapitalGains]
  );

  // Initialize the current portfolio
  const initCurrentPortfolio = useCallback((portfolios) => {
    const lastViewedPortfolioId = localStorage.getItem("lastPortfolioViewed"); // get last viewed portfolio id from local storage
    let portfolio = null;
    if (lastViewedPortfolioId)
      portfolio = portfolios.find(
        (p) => p.portfolio_id === lastViewedPortfolioId
      ); // find user portfolio with the id
    if (!portfolio)
      portfolio = portfolios.find((p) => p.portfolio_name === "Main"); // if not found, get the 'main' portfolio
    setCurrentPortfolio(portfolio); // set current portfolio
    return portfolio;
  }, []);

  // ref that keeps track of when component unmounts
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // retrieve user portfolios and assets
  useEffect(() => {
    const controller = new AbortController();
    const retrieveData = async () => {
      try {
        const response = await Portfolios.get("/", {
          signal: controller.signal,
        });
        // jwt token expired
        if (response.data.error) isAuthenticated();
        else {
          // merge user transactions with coin details
          const merged = formatData.mergeWithCoinRankingData(response.data.assets, assets)

          if (mountedRef.current) {
            setPortfolios(response.data.portfolios);
            setTransactions(merged);
            const currentPortfolio = initCurrentPortfolio(response.data.portfolios);
            createBuyTransactionMap(currentPortfolio, merged);
            setLoading(false);
          }
        }
      } catch (error) {
        if (mountedRef.current) {
          console.log(error);
          setLoading(false);
          setError(true);
        }
      }
    };
    retrieveData();
    return () => {
      controller.abort();
    };
  }, [
    history,
    isAuthenticated,
    assets,
    createBuyTransactionMap,
    initCurrentPortfolio,
  ]);

  const updateSelected = (selected) => {
    console.log(selected)
    setSelected(selected);
  };

  const sellTransaction = () => {
    //manage.print('Ethereum')
  };

  const updateCurrentPortfolio = (p) => {
    setCurrentPortfolio(p);
    localStorage.setItem("lastPortfolioViewed", p.portfolio_id);
    createBuyTransactionMap(p.portfolio_id, transactions);
  };

  // Delete an asset (delete all transactions of an asset)
  const deleteAsset = async (cb) => {
    // Get uuid of asset and portfolio id user is deleting from
    const coin_id = selected.uuid;
    const portfolio_id = selected.portfolio_id;
    try {
      // Delete all transactions of an asset in specified portfolio from database
      const response = await Transactions.delete("/delete-asset", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        data: {
          coin_id,
          portfolio_id,
        },
      });
      // Failed to authenticate
      if (response.data.error) isAuthenticated();
      else {
        // Create new array without deleted transactions
        let array = transactions.filter((t) => {
          return (
            t.asset_id !== coin_id ||
            (t.asset_id === coin_id && t.portfolio_id !== portfolio_id)
          );
        });
        // Set transactions state to new array
        setTransactions(array);
        createBuyTransactionMap(currentPortfolio.portfolio_id, array);
        cb();
      }
    } catch (error) {
      cb(error);
    }
  };

  // Add a new transaction
  const addTransaction = async (quantity, pricePerCoin, type, date, cb) => {
    // Get uuid of asset
    const assetId = selected.uuid;
    try {
      // Add transaction to database
      const asset = await Portfolios.post(
        `/${currentPortfolio.portfolio_id}/transactions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          coin_id: assetId,
          quantity,
          pricePerCoin,
          type,
          date,
        }
      );
      // Failed to authenticate
      if (asset.data.error) isAuthenticated();
      else {
        // Find the transaction asset's coin details
        let coinDetails = assets.filter(
          (a) => a.uuid === asset.data.rows[0].asset_id
        )[0];

        // Merge coin details with the transaction details and add to the transactions state
        coinDetails = {
          ...asset.data.rows[0],
          ...coinDetails,
        };
        let array = transactions.concat(coinDetails);
        array.sort(function (a, b) {
          return new Date(a.transaction_date) - new Date(b.transaction_date);
        });
        setTransactions(array);
        createBuyTransactionMap(currentPortfolio.portfolio_id, array);
        cb();
      }
    } catch (e) {
      cb(e);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (cb) => {
    // Get id of transaction
    const transaction_id = selected.transaction_id;
    try {
      // Delete transaction from database
      const response = await Transactions.delete("/delete-transaction", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        data: {
          transaction_id,
        },
      });
      // Failed to authenticate
      if (response.data.error) isAuthenticated(); 
      else {
        // Create new array without deleted transaction
        const arr = transactions.filter(
          (t) => t.transaction_id !== transaction_id
        );
        if (!arr.length) setTransactions([arr]);
        else setTransactions(arr);
        createBuyTransactionMap(currentPortfolio.portfolio_id, arr);
        cb();
      }
    } catch (e) {
      cb(e);
    }
  };

  // Edit transaction price per coin and/or amount
  const editTransaction = async (quantity, pricePerCoin, cb) => {
    // Get id of transaction
    const transaction_id = selected.transaction_id;
    try {
      // Edit transaction in database
      const response = await Transactions.put("/edit-transaction", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        quantity,
        pricePerCoin,
        transaction_id,
      });
      // Failed to authenticate
      if (response.data.error) isAuthenticated();
      else {
        // Create new transactions array with newly edited transaction
        const array = transactions.map((t) => {
          if (t.transaction_id === transaction_id) {
            t.asset_amount = quantity;
            t.initial_price = pricePerCoin;
          }
          return t;
        });
        // Set transactions state to new array
        setTransactions(array);
        createBuyTransactionMap(currentPortfolio.portfolio_id, array);
        cb();
      }
    } catch (e) {
      cb(e);
    }
  };

  // Delete a portfolio and all associated assets/transacations
  const deletePortfolio = async (p, cb) => {
    const portfolio_id = p.portfolio_id;
    try {
      const response = await Portfolios.delete(`/${portfolio_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      // Failed to authorize
      if (response.data.error) isAuthenticated();
      else {
        setTransactions(
          transactions.filter((t) => t.portfolio_id !== portfolio_id)
        );
        setPortfolios(
          portfolios.filter((p) => p.portfolio_id !== portfolio_id)
        );
        if (portfolio_id === currentPortfolio.portfolio_id) {
          updateCurrentPortfolio(portfolios[0]);
          //createBuyTransactionMap(portfolios[0], transactions)
        }
        cb();
      }
    } catch (e) {
      cb(e);
    }
  };

  // Create a new portfolio
  const createPortfolio = async (name, cb, main = "f") => {
    // Query database with new portfolio
    try {
      const response = await Portfolios.post("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        name,
        main,
      });
      // Failed to authenticate
      if (response.data.error) isAuthenticated();
        // Unmount create new portfolio form and add new portfolio to portfolios state
      else {
        if (!portfolios.length) updateCurrentPortfolio(response.data.rows[0]);
        setPortfolios((prevState) => prevState.concat(response.data.rows[0]));
        cb();
      }
    } catch (e) {
      cb(e);
    }
  };

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
    sellTransaction,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {loading || !portfolios || !transactions ? (
        <div className="loading-page">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <Error error={"Server error"} />
      ) : (
        children
      )}
    </PortfolioContext.Provider>
  );
}