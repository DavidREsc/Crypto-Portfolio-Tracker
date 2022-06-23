import React, { useEffect, useState } from 'react'
import {AiFillEdit} from 'react-icons/ai';
import {IoMdCloseCircle} from 'react-icons/io';
import formatData from '../../utils/formatData';

const Transactions = (props) => {
    const {handlePortfolio, allTransactions, selectedUserAsset, handleEditTransaction, handleDeleteTransaction} = props;
    const [quantity, setQuantity] = useState();
    const [balance, setBalance] = useState();
    const [averageBuy, setAverageBuy] = useState();
    const [transactions, setTransactions] = useState();

    useEffect(() => {
      if (allTransactions.length) {
        const transactions = allTransactions.filter(t => t.uuid === selectedUserAsset.uuid && t.portfolio_id === selectedUserAsset.portfolio_id);
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
        else handlePortfolio();
      }
    },[allTransactions, selectedUserAsset, handlePortfolio])

  return (
    <div className='portfolio-content'>
      {transactions &&
        <>
        <button className='back-btn' onClick={handlePortfolio}>Back</button>
        <div className='transaction-title'>
          <img className='transaction-asset-img' src={transactions[0].iconUrl} alt={transactions[0].name}></img>
          <h3>{transactions[0].name + " Transactions"}</h3>
        </div>
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
                    <td className='first-td'>
                      <div>
                        <p>Buy</p>
                      </div>
                    </td>
                    <td>{'$' + formatData.formatNumber(t.initial_price)}</td>
                    <td>
                      <div>
                        {'$' + formatData.formatNumber(t.asset_amount * t.initial_price)}
                        <p className='holdings'>{t.asset_amount + " " + t.symbol}</p>
                      </div>
                    </td>
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