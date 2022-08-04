import React, { useEffect, useState } from 'react'
import {AiFillEdit} from 'react-icons/ai';
import {IoMdCloseCircle} from 'react-icons/io';
import formatData from '../../utils/formatData';

// Table for showing all transaction of a particular asset
const Transactions = (props) => {
    const {handlePortfolio, allTransactions, selectedUserAsset, handleEditTransaction, handleDeleteTransaction} = props;
    const [quantity, setQuantity] = useState();
    const [balance, setBalance] = useState();
    const [averageBuy, setAverageBuy] = useState();
    const [transactions, setTransactions] = useState();


    useEffect(() => {
      if (allTransactions.length) {
        // Filter for transactions of selected asset in current portfolio
        const transactions = allTransactions.filter(t => t.uuid === selectedUserAsset.uuid && t.portfolio_id === selectedUserAsset.portfolio_id);

        // Calculate total quantity, balance, and average buy price from transactions
        if (transactions.length) {
          let quantity = 0;
          let balance = 0;
          let averageBuy = 0;
          for (let i = 0; i < transactions.length; i++) {
            quantity += transactions[i].asset_amount;
            balance += (transactions[i].asset_amount * transactions[i].price);
            averageBuy += transactions[i].initial_price
          }
          averageBuy = (averageBuy / transactions.length);
      
          setQuantity(quantity);
          setBalance(balance);
          setAverageBuy(averageBuy);
          setTransactions(transactions);
        }
        // triggers if you delete all transactions while this component is mounted
        else handlePortfolio();
      }
    },[allTransactions, selectedUserAsset, handlePortfolio])

  return (
    
    <div className='portfolio-content'>
      {transactions &&
        <>
        {/* Back button to go back to portfolio content table */}
        <button className='back-btn' onClick={handlePortfolio}>Back</button>

        {/* Asset title and image */}
        <div className='transaction-title'>
          <img className='transaction-asset-img' src={transactions[0].iconUrl} alt={transactions[0].name}></img>
          <h3>{transactions[0].name + " Transactions"}</h3>
        </div>

        {/* Balance, quantity and avg. buy price */}
        <div className='transactions-stats-container'>
          <div className='transactions-stats'>
            <p>Balance</p>
            <p className='transactions-stats-value'>{'$' + formatData.formatNumber(balance)}</p>
          </div>
          <div className='transactions-stats'>
            <p>Quantity</p>
            <p className='transactions-stats-value'>{quantity + " " + transactions[0].symbol}</p>
          </div>
          <div className='transactions-stats'>
            <p >Avg. Buy Price</p>
            <p className='transactions-stats-value'>{'$' + formatData.formatNumber(averageBuy)}</p>
          </div>
        </div>

      {/* Transactions table */}
      <div className='asset-table-container'>
        <table className='asset-table'>
            <thead>
                <tr>
                    <th className='first-header'>Type</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th className='last-header'>Actions</th>
                </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => {
                return (
                  <tr key={idx}>

                    {/* Type column */}
                    <td className='first-td'>
                      <div>
                        <p>Buy</p>
                      </div>
                    </td>

                    {/* Price bought at*/}
                    <td>{'$' + formatData.formatNumber(t.initial_price)}</td>

                    {/* Amount bought in dollars and quantity */}
                    <td>
                      <div>
                        {'$' + formatData.formatNumber(t.asset_amount * t.initial_price)}
                        <p className='holdings'>{t.asset_amount + " " + t.symbol}</p>
                      </div>
                    </td>

                    {/* Actions: edit, delete */}
                    <td className='last-td'>
                      <div className='actions'>
                        <button className='edit-transaction' onClick={() => handleEditTransaction(t)}>
                          <AiFillEdit className='edit-transaction-icon'/>
                        </button>
                        <button className='delete-asset' onClick={() => handleDeleteTransaction(t)}>
                          <IoMdCloseCircle className='delete-asset-icon' />
                        </button>                   
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
        </table>
      </div>
      </>}
    </div>
  )
}

export default Transactions