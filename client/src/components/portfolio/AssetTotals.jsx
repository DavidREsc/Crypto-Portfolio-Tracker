import React from 'react'
import {VscTriangleDown} from 'react-icons/vsc';
import formatData from '../../utils/formatData';

const AssetTotals = (props) => {
	const {totalWorth, totalChange, totalProfitLoss, capitalGains} = props
  return (
		<div className='total-asset-worth-container'>
      <div>
        <div className='balance-container'>
          <p className='current-balance'>Current balance</p>
          <div className='total-worth-change'>
            <h2 className='total-worth'>{'$' + totalWorth}</h2>
            <div className='total-change' style={totalChange < 0 ? {color: '#f44336'} : {color: 'hsl(145, 100%, 36%)'}}>
              <VscTriangleDown style={totalChange < 0 ? '' : {transform: 'rotate(180deg)'}}/>
              <h3>{Math.abs(totalChange).toFixed(2) + '%'}</h3>
            </div>
          </div>      
        </div>
        <div className='total-profit-loss' style={totalChange < 0 ? {color: '#f44336'} : {color: 'hsl(145, 100%, 36%)'}}>
          <h3>{(totalChange >= 0 ? '+ $' : '- $') + totalProfitLoss}</h3>
        </div>
      </div>
      <div>
        <h2>Capital Gains</h2>
        <p className='capital-gains'style={{color: capitalGains < 0 ? '#f44336' : 'hsl(145, 100%, 36%)'}}>
        {capitalGains < 0 ? '-$' + formatData.formatNumber(Math.abs(capitalGains)) : '$' + formatData.formatNumber(capitalGains)}
        </p>
      </div>
    </div>
  )
}

export default AssetTotals