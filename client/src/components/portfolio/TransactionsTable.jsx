import React from 'react'
import {formatNumber} from '../../utils/formatData'
import {AiFillEdit} from 'react-icons/ai';
import {IoMdCloseCircle} from 'react-icons/io';

const TransactionsTable = (props) => {
    const {transactions, showEditTransactionForm, showDeleteTransactionForm} = props
  return (
    <div className='asset-table-container'>
        <table className='asset-table'>
            <thead>
                <tr>
                    <th className='first-header'>Type</th>
                    <th className='date-header'>Date</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th className='last-header'>Actions</th>
                </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => {
                const date = new Date(t.transaction_date)
                return (
                  <tr key={idx}>

                    {/* Type column */}
                    <td className='first-td-trns'>
                      <div>
                        <p>{t.transaction_type}</p>
                      </div>
                    </td>

                    <td className='date-col'>
                      {date.toLocaleDateString()}
                    </td>

                    {/* Price bought at*/}
                    <td>{'$' + formatNumber(t.initial_price)}</td>

                    {/* Amount bought in dollars and quantity */}
                    <td>
                      <div>
                        {'$' + formatNumber(t.asset_amount * t.initial_price)}
                        <p className='holdings'>{t.asset_amount + " " + t.symbol}</p>
                      </div>
                    </td>

                    {/* Actions: edit, delete */}
                    <td className='last-td'>
                      <div className='actions'>
                        <button className='edit-transaction' onClick={() => showEditTransactionForm(t)}>
                          <AiFillEdit className='edit-transaction-icon'/>
                        </button>
                        <button className='delete-asset' onClick={() => showDeleteTransactionForm(t)}>
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
  )
}

export default TransactionsTable