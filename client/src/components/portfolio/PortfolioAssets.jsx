import React, { useState, useEffect, useRef } from "react";
import AssetTotals from "./AssetTotals";
import { useAssets } from "../../contexts/AssetsContext";
import PortfolioTable from "./PortfolioTable";
import DeleteForm from "./DeleteForm";
import { usePortfolio } from "../../contexts/PortfolioContext";
import Button1 from "../buttons/Button1";
import BrowseForm from "./BrowseForm";
import TransactionForm from "./TransactionForm";
import { toastError } from "../../utils/toasts";
import {
  calculateTotalWorth,
  calculatePercentChange,
  calculateProfitLossHoldings,
  mergeTransactions,
  formatNumber,
  formatPPC,
  sortAssets
} from "../../utils/formatData"

const PortfolioAssets = (props) => {
  const [totalWorth, setTotalWorth] = useState(0);
  const [totalChange, setTotalChange] = useState(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [curPortfolioAssets, setCurPortfolioAssets] = useState();
  const [loading, setLoading] = useState(true);
  const [queryLoading, setQueryLoading] = useState(false);
  const [deleteAssetFormDisplay, setDeleteAssetFormDisplay] = useState(false);
  const [browseAssetFormDisplay, setBrowseAssetFormDisplay] = useState(false);
  const [transactionFormDisplay, setTransactionFormDisplay] = useState(false);

  const { assets } = useAssets();
  const {
    transactions,
    currentPortfolio,
    updateSelected,
    deleteAsset,
    addTransaction,
    selected,
    capitalGains,
  } = usePortfolio();
  const { showTransactionsTable } = props;

  const deleteFormRef = useRef(null);
  const browseFormRef = useRef(null);
  const transactionFormRef = useRef(null);

  // Perform all calculations for transactions in currently viewed portfolio
  useEffect(() => {
    const curPortfolioAssets = transactions.filter(
      (t) => t.portfolio_id === currentPortfolio.portfolio_id
    )
    const {currentWorth, initialWorth} = calculateTotalWorth(curPortfolioAssets)
    const totalPercentChange = calculatePercentChange(currentWorth, initialWorth)
    const {calculatedTransactions, totalProfitLoss} = calculateProfitLossHoldings(curPortfolioAssets)
    const mergedTransactions = mergeTransactions(calculatedTransactions)
    mergedTransactions.sort(sortAssets)

    setCurPortfolioAssets(mergedTransactions)
    setTotalWorth(formatNumber(currentWorth))
    setTotalChange(totalPercentChange)
    setTotalProfitLoss(formatNumber(Math.abs(totalProfitLoss)));
    setLoading(false);
  }, [transactions, assets, currentPortfolio])

  // Add event listener for mouse click outside forms
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (deleteFormRef.current && !deleteFormRef.current.contains(e.target)) {
        setDeleteAssetFormDisplay(false);
      } else if (browseFormRef.current && !browseFormRef.current.contains(e.target)) {
        setBrowseAssetFormDisplay(false);
      } else if (transactionFormRef.current && !transactionFormRef.current.contains(e.target)) {
        setTransactionFormDisplay(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handler for deleting all transactions of a particular asset
  const handleDeleteAsset = () => {
    setQueryLoading(true);
    deleteAsset((e) => {
      if (e) toastError("Server error. Please try again later");
      else {
        setDeleteAssetFormDisplay(false);
      }
      setQueryLoading(false);
    });
  };

  // Handler for adding a transaction
  const handleAddTransaction = (data) => {
    const { quantity, pricePerCoin, type, reactDatepicker } = data;
    setQueryLoading(true);
    addTransaction(
      quantity,
      parseFloat(formatPPC(pricePerCoin)),
      type,
      reactDatepicker.toLocaleDateString(),
      (e) => {
        if (e) toastError("Server error. Please try again later");
        else {
          setTransactionFormDisplay(false);
        }
        setQueryLoading(false);
      }
    );
  };

  // Handler for selecting an asset in the choose asset form
  const handleSelect = (e) => {
    let asset = assets.filter((a) => a.uuid === e.target.dataset.asset)[0];
    updateSelected(asset);
    setTransactionFormDisplay(true);
    setBrowseAssetFormDisplay(false);
  };

  const showDeleteAssetForm = (asset) => {
    setDeleteAssetFormDisplay(true);
    updateSelected(asset);
  };

  const handleTrnsBackBtn = () => {
    setTransactionFormDisplay(false);
    setBrowseAssetFormDisplay(true);
  };

  return (
    <div className="portfolio-content">
      {!loading && (
        <>
          <AssetTotals
            totalWorth={totalWorth}
            totalChange={totalChange}
            totalProfitLoss={totalProfitLoss}
            capitalGains={capitalGains}
          />
          <PortfolioTable
            curPortfolioAssets={curPortfolioAssets}
            showTransactions={showTransactionsTable}
            showDeleteAssetForm={showDeleteAssetForm}
          />
          <div className="add-new-btn">
            <Button1
              text={"Add New"}
              func={() => setBrowseAssetFormDisplay(true)}
            />
          </div>
          {browseAssetFormDisplay && (
            <BrowseForm
              reference={browseFormRef}
              closeForm={() => setBrowseAssetFormDisplay(false)}
              handleSelect={handleSelect}
            />
          )}
          {deleteAssetFormDisplay && (
            <DeleteForm
              reference={deleteFormRef}
              deleteFunc={handleDeleteAsset}
              closeForm={() => setDeleteAssetFormDisplay(false)}
              title={"Delete Asset?"}
              text={
                "Any transactions associated with this asset will also be removed."
              }
              loading={queryLoading}
            />
          )}
          {transactionFormDisplay && (
            <TransactionForm
              reference={transactionFormRef}
              addTransaction={handleAddTransaction}
              handleTrnsBackBtn={handleTrnsBackBtn}
              defaultPrice={formatPPC(parseFloat(selected.price))}
              closeForm={() => setTransactionFormDisplay(false)}
              icon={selected.iconUrl}
              name={selected.name}
              loading={queryLoading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PortfolioAssets;
