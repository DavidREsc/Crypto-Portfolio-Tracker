import React from 'react'

const AssetStats = (props) => {
	const {quantity, balance, averageBuy, symbol} = props
  return (
    <div className='transactions-stats-container'>
      <div className='transactions-stats'>
        <p>Balance</p>
        <p className='transactions-stats-value'>{'$' + balance}</p>
      </div>
      <div className='transactions-stats'>
        <p>Quantity</p>
        <p className='transactions-stats-value'>{quantity + " " + symbol}</p>
      </div>
      <div className='transactions-stats'>
        <p >Avg. Buy Price</p>
        <p className='transactions-stats-value'>{'$' + averageBuy}</p>
      </div>
    </div>
  )
}

export default AssetStats