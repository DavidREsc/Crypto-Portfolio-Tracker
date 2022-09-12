import React, {useEffect, useState, useRef} from 'react'
import Button1 from '../buttons/Button1'
import { usePortfolio } from '../../contexts/PortfolioContext'
import formatData from '../../utils/formatData'
import AssetStats from './AssetStats'
import TransactionsTable from './TransactionsTable'
import TransactionsTitle from './TransactionsTitle'
import EditTransactionForm from './EditTransactionForm'
import DeleteForm from './DeleteForm'

const PortfolioTransactions = (props) => {
  const {showPortfolioTable} = props
	const {transactions, selected, updateSelected, deleteTransaction, editTransaction} = usePortfolio()
	const [quantity, setQuantity] = useState()
	const [balance, setBalance] = useState()
	const [averageBuy, setAverageBuy] = useState()
	const [assetTransactions, setAssetTransactions] = useState()
	const [editTransactionFormDisplay, setEditTrasactionFormDisplay] = useState(false)
	const [deleteTransactionFormDisplay, setDeleteTrasactionFormDisplay] = useState(false)
	const [queryLoading, setQueryLoading] = useState()
	const editTransactionFormRef = useRef(null)
	const deleteTransactionFormRef = useRef(null)

	useEffect(() => {
		if (transactions.length) {
			// Filter for transactions of selected asset in current portfolio
			const assetTransactions = transactions.filter(t => t.uuid === selected.uuid && t.portfolio_id === selected.portfolio_id);

			// Calculate total quantity, balance, and average buy price from transactions
			if (assetTransactions.length) {
				let quantity = 0;
				let balance = 0;
				let averageBuy = 0;
				for (let i = 0; i < assetTransactions.length; i++) {
					if (assetTransactions[i].transaction_type === 'buy') {
						quantity += assetTransactions[i].asset_amount;
						balance += (assetTransactions[i].asset_amount * assetTransactions[i].price);
						averageBuy += assetTransactions[i].initial_price
					}
				}
				averageBuy = (averageBuy / assetTransactions.length);
		
				setQuantity(quantity);
				setBalance(formatData.formatNumber(balance));
				setAverageBuy(formatData.formatNumber(averageBuy));
				setAssetTransactions(assetTransactions);
			}
			// triggers if you delete all transactions while this component is mounted
			else {
				showPortfolioTable()
			}
		}
	},[transactions, selected, showPortfolioTable])

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (editTransactionFormRef.current && !editTransactionFormRef.current.contains(e.target)) {
				setEditTrasactionFormDisplay(false)
			} else if (deleteTransactionFormRef.current && !deleteTransactionFormRef.current.contains(e.target)) {
				setDeleteTrasactionFormDisplay(false)
		  }
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleDeleteTransaction = () => {
		setQueryLoading(true)
		deleteTransaction((e) => {
			if (e) console.log('error')
			else {
				setDeleteTrasactionFormDisplay(false)
			}
			setQueryLoading(false)
		})
	}
	const handleEditTransaction = (data) => {
		const {quantity, pricePerCoin} = data
		setQueryLoading(true)
		editTransaction(quantity, parseFloat(formatData.formatPPC(pricePerCoin)), (e) => {
			if (e) console.log('error')
			else {
				setEditTrasactionFormDisplay(false)
			}
			setQueryLoading(false)
		})
	}

	const showEditTransactionForm = (asset) => {
		updateSelected(asset)
		setEditTrasactionFormDisplay(true)
	}

	const showDeleteTransactionForm = (asset) => {
		updateSelected(asset)
		setDeleteTrasactionFormDisplay(true)
	}

  return (
    <div className='portfolio-content'>
			{assetTransactions &&
			  <>
        <div className='trns-back-btn'>
            <Button1 text='back' func={showPortfolioTable}/>
        </div>
				<TransactionsTitle
					icon={assetTransactions[0].iconUrl} 
					name={assetTransactions[0].name}
				/>
				<AssetStats 
					quantity={quantity}
					balance={balance}
					averageBuy={averageBuy}
					symbol={assetTransactions[0].symbol}
				/>
				<TransactionsTable 
					transactions={assetTransactions}
					showDeleteTransactionForm={showDeleteTransactionForm}
					showEditTransactionForm={showEditTransactionForm}
				/>
				{editTransactionFormDisplay &&
					<EditTransactionForm 
						reference={editTransactionFormRef}
						editTransaction={handleEditTransaction}
						closeForm={() => setEditTrasactionFormDisplay(false)}
						name={assetTransactions[0].name}
						icon={assetTransactions[0].iconUrl}
						defaultPrice={selected.initial_price}
						defaultQuantity={selected.asset_amount}
						loading={queryLoading}
					/>
				}
				{deleteTransactionFormDisplay &&
					<DeleteForm 
						reference={deleteTransactionFormRef}
						deleteFunc={handleDeleteTransaction}
						closeForm={() => setDeleteTrasactionFormDisplay(false)}
						title={'Delete Transaction'}
						text={'Are you sure you want to delete this transaction?'}
						loading={queryLoading}
					/>
				}
				</>
			}		
    </div>
  )
}

export default PortfolioTransactions