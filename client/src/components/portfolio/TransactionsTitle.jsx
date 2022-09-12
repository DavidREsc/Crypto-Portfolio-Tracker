import React from 'react'

const TransactionsTitle = (props) => {
    const {icon, name} = props
  return (
    <div className='transaction-title'>
        <img className='transaction-asset-img' src={icon} alt={name}></img>
        <h3>{name + " Transactions"}</h3>
    </div>
  )
}

export default TransactionsTitle