import React, {createContext, useContext, useEffect, useState, useCallback} from 'react'
import { useAssets } from './AssetsContext';
import { useAuth } from './AuthContext';
import { LoadingSpinner } from '../styles/Loading.styled';
import Portfolios from '../apis/Portfolios';
import Transactions from '../apis/Transactions';
import Error from '../components/Error';
import {useHistory} from 'react-router-dom';
import Map from '../utils/Map';
import {mergeWithCoinRankingData} from '../utils/formatData'

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

  // retrieve user portfolios and assets
  useEffect(() => {
    const controller = new AbortController();
    const retrieveData = async () => {
      try {
        const {data} = await Portfolios.get("/", {
          signal: controller.signal,
        });
        // jwt token expired
        if (data.error) {
          isAuthenticated();
          return
        }
        // merge user transactions with coin details
        const mergedTransactions = mergeWithCoinRankingData(data.assets, assets)
        const currentPortfolio = initCurrentPortfolio(data.portfolios);
        setPortfolios(data.portfolios);
        setTransactions(mergedTransactions);
        createBuyTransactionMap(currentPortfolio.portfolio_id, mergedTransactions);
        setLoading(false);

      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);
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

  const updateSelected = (selected) => setSelected(selected);

  const updateCurrentPortfolio = (portfolio) => {
    const {portfolio_id} = portfolio
    setCurrentPortfolio(portfolio);
    localStorage.setItem("lastPortfolioViewed", portfolio_id);
    createBuyTransactionMap(portfolio_id, transactions);
  };

  // Delete an asset (delete all transactions of an asset)
  const deleteAsset = async (cb) => {
    // Get uuid of asset and portfolio id user is deleting from
    const {uuid: coin_id, portfolio_id} = selected
    try {
      // Delete all transactions of an asset in specified portfolio from database
      const response = await Transactions.delete("/delete-asset", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        data: {coin_id, portfolio_id}
      });
      // Failed to authenticate
      if (response.data.error) {
        isAuthenticated();
        return
      }
      // Create new array without deleted transactions
      let updatedTransactions = transactions.filter((t) => 
          t.asset_id !== coin_id ||
          (t.asset_id === coin_id && t.portfolio_id !== portfolio_id)
      );
      // Set transactions state to new array
      setTransactions(updatedTransactions);
      createBuyTransactionMap(currentPortfolio.portfolio_id, updatedTransactions);
      cb();
    } catch (error) {
      cb(error);
    }
  };

  // Add a new transaction
  const addTransaction = async (quantity, pricePerCoin, type, date, cb) => {
    // Get uuid of asset
    const {uuid: assetId} = selected
    try {
      // Add transaction to database
      const {data} = await Portfolios.post(
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
      if (data.error) {
        isAuthenticated();
        return
      }
      // Find the transaction asset's coin details
      const coinDetails = assets.find((a) => a.uuid === data.rows[0].asset_id)
      // Merge coin details with the transaction details and add to the transactions state
      const newTransaction = {
        ...data.rows[0],
        ...coinDetails,
      };
      let updatedTransactions = [...transactions, newTransaction]
      updatedTransactions.sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));
      setTransactions(updatedTransactions);
      createBuyTransactionMap(currentPortfolio.portfolio_id, updatedTransactions);
      cb();
    } catch (e) {
      cb(e);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (cb) => {
    // Get id of transaction
    const {transaction_id} = selected
    try {
      // Delete transaction from database
      const {data} = await Transactions.delete("/delete-transaction", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        data: {transaction_id}
      });
      // Failed to authenticate
      if (data.error) {
        isAuthenticated(); 
        return
      }
      // Create new array without deleted transaction
      const updatedTransactions = transactions.filter(
        (t) => t.transaction_id !== transaction_id
      );
      if (!updatedTransactions.length) setTransactions([updatedTransactions]);
      else setTransactions(updatedTransactions);
      createBuyTransactionMap(currentPortfolio.portfolio_id, updatedTransactions);
      cb();
    } catch (e) {
      cb(e);
    }
  };

  // Edit transaction price per coin and/or amount
  const editTransaction = async (quantity, pricePerCoin, cb) => {
    // Get id of transaction
    const {transaction_id} = selected
    try {
      // Edit transaction in database
      const {data} = await Transactions.put("/edit-transaction", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        quantity,
        pricePerCoin,
        transaction_id,
      });
      // Failed to authenticate
      if (data.error) {
        isAuthenticated();
        return
      }
      // Create new transactions array with newly edited transaction
      const updatedTransactions = transactions.map((t) => {
        if (t.transaction_id === transaction_id) {
          t.asset_amount = quantity;
          t.initial_price = pricePerCoin;
        }
          return t;
      });
      // Set transactions state to new array
      setTransactions(updatedTransactions);
      createBuyTransactionMap(currentPortfolio.portfolio_id, updatedTransactions);
      cb();
    } catch (e) {
      cb(e);
    }
  };

  // Delete a portfolio and all associated assets/transacations
  const deletePortfolio = async (p, cb) => {
    const portfolio_id = p.portfolio_id;
    try {
      const {data} = await Portfolios.delete(`/${portfolio_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      // Failed to authorize
      if (data.error) {
        isAuthenticated();
        return
      }
      setTransactions(
        transactions.filter((t) => t.portfolio_id !== portfolio_id)
      );
      setPortfolios(
        portfolios.filter((p) => p.portfolio_id !== portfolio_id)
      );
      if (portfolio_id === currentPortfolio.portfolio_id) {
        updateCurrentPortfolio(portfolios[0]);
      }
      cb();
    } catch (e) {
      cb(e);
    }
  };

  // Create a new portfolio
  const createPortfolio = async (name, cb, main = "f") => {
    // Query database with new portfolio
    try {
      const {data} = await Portfolios.post("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        name,
        main,
      });
      // Failed to authenticate
      if (data.error) {
        isAuthenticated();
        return
      }
      // Unmount create new portfolio form and add new portfolio to portfolios state
      if (!portfolios.length) updateCurrentPortfolio(data.rows[0]);
      setPortfolios((prevState) => prevState.concat(data.rows[0]));
      cb();
    } catch (e) {
      console.log(e)
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