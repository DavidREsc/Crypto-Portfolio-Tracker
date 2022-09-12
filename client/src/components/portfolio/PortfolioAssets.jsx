import React, {useState, useEffect, useRef} from 'react'
import AssetTotals from './AssetTotals';
import { useAssets } from '../../contexts/AssetsContext';
import formatData from '../../utils/formatData';
import PortfolioTable from './PortfolioTable';
import DeleteForm from './DeleteForm';
import { usePortfolio } from '../../contexts/PortfolioContext';
import Button1 from '../buttons/Button1';
import BrowseForm from './BrowseForm';
import TransactionForm from './TransactionForm'


const PortfolioAssets = (props) => {

  const [totalWorth, setTotalWorth] = useState(0);
  const [totalChange, setTotalChange] = useState(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0)
  const [curPortfolioAssets, setCurPortfolioAssets] = useState();
  const [loading, setLoading] = useState(true);
	const [queryLoading, setQueryLoading] = useState(false)
	const [deleteAssetFormDisplay, setDeleteAssetFormDisplay] = useState(false) 
	const [browseAssetFormDisplay, setBrowseAssetFormDisplay] = useState(false)
	const [transactionFormDisplay, setTransactionFormDisplay] = useState(false)

	const {assets} = useAssets();
	const {transactions, currentPortfolio, updateSelected, deleteAsset, addTransaction, selected, capitalGains} = usePortfolio()
	const {showTransactionsTable} = props

	const deleteFormRef = useRef(null);
	const browseFormRef = useRef(null)
	const transactionFormRef = useRef(null)

	useEffect(() => {
		let worth = 0, initial = 0, change = 0, totalProfitLoss = 0
		let curPortfolioAssets = [];
		if (transactions.length) {
			// filter for assets in current portfolio
			curPortfolioAssets = transactions.filter(t => t.portfolio_id === currentPortfolio.portfolio_id && t.transaction_type === 'buy');

			// calculate total worth and percent change
			if (curPortfolioAssets.length) {
				let data = formatData.calculateTotalWorth(curPortfolioAssets)
				worth = data.worth
				initial = data.initial
				change = formatData.calculatePercentChange(worth, initial);

				// calculate profit/loss, holdings and initial holdings in dollars
				let calculated = formatData.calculateProfitLossHoldings(curPortfolioAssets)
				curPortfolioAssets = calculated.calculated
				totalProfitLoss = calculated.totalProfitLoss

				// merge transactions
				curPortfolioAssets = formatData.mergeTransactions(curPortfolioAssets)
				// sort assets from greatest to least in holdings amount
				curPortfolioAssets.sort(formatData.sortAssets)
			}
		}
		setCurPortfolioAssets(curPortfolioAssets);
		setTotalWorth(formatData.formatNumber(worth));
		setTotalChange(change);
		setTotalProfitLoss(formatData.formatNumber(Math.abs(totalProfitLoss)))
		setLoading(false);
	},[transactions, assets, currentPortfolio])

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (deleteFormRef.current && !deleteFormRef.current.contains(e.target)) {
				setDeleteAssetFormDisplay(false)
			} else if (browseFormRef.current && !browseFormRef.current.contains(e.target)) {
				setBrowseAssetFormDisplay(false)
			} else if (transactionFormRef.current && !transactionFormRef.current.contains(e.target)) {
				setTransactionFormDisplay(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleDeleteAsset = () => {
		setQueryLoading(true)
		deleteAsset((e) => {
			if (e) console.log('error')
			else {
				setDeleteAssetFormDisplay(false)
			}
			setQueryLoading(false)
		})
	}

	const handleAddTransaction = (data) => {
		const {quantity, pricePerCoin, type, reactDatepicker} = data
		setQueryLoading(true)
		addTransaction(quantity, parseFloat(formatData.formatPPC(pricePerCoin)), type, reactDatepicker.toLocaleDateString(), (e) => {
			if (e) console.log('error')
			else {
				setTransactionFormDisplay(false)
			}
			setQueryLoading(false)
		})
	}



	const handleSelect = (e) => {
		let asset = assets.filter(a => a.uuid === e.target.dataset.asset)[0];
		updateSelected(asset)
		setTransactionFormDisplay(true)
		setBrowseAssetFormDisplay(false)
	}

	const showDeleteAssetForm = (asset) => {
		setDeleteAssetFormDisplay(true)
		updateSelected(asset)
	}

	const handleTrnsBackBtn = () => {
		setTransactionFormDisplay(false)
		setBrowseAssetFormDisplay(true)
	}

  return (
    <div className='portfolio-content'>
		{!loading &&
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
			<div className='add-new-btn'>
				<Button1 
					text={'Add New'}
					func={() => setBrowseAssetFormDisplay(true)}
				/>
			</div>
			{browseAssetFormDisplay &&
				<BrowseForm 
					reference={browseFormRef}
					closeForm={() => setBrowseAssetFormDisplay(false)}
					handleSelect={handleSelect}
				/>
			}
			{deleteAssetFormDisplay &&
				<DeleteForm 
					reference={deleteFormRef}
					deleteFunc={handleDeleteAsset}
					closeForm={() => setDeleteAssetFormDisplay(false)}
					title={'Delete Asset?'}
					text={'Any transactions associated with this asset will also be removed.'}
					loading={queryLoading}
				/>
			}
			{transactionFormDisplay &&
				<TransactionForm 
					reference={transactionFormRef}
					addTransaction={handleAddTransaction}
          			handleTrnsBackBtn={handleTrnsBackBtn}
					defaultPrice={formatData.formatPPC(parseFloat(selected.price))}
          			closeForm={() => setTransactionFormDisplay(false)}
					icon={selected.iconUrl}
					name={selected.name}
					loading={queryLoading}
				/>
			}
			</>
		}
		</div>
  )
}

export default PortfolioAssets