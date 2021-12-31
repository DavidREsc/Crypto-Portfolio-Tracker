import React from 'react'
import '../../styles/coindetails.css';
import {VscTriangleDown} from 'react-icons/vsc';

const Titles = (props) => {

   const {price, coinDetails} = props; 

    return (
        coinDetails.length !== 0 &&  
        <div className='titles'>
            <h1 className='name-symbol' >{coinDetails.name + " " +
                coinDetails.symbol.toUpperCase()}
            </h1>
            <div style={coinDetails.market_data.price_change_percentage_24h < 0 ? {color:'red'} : {color:'green'}} className='price-percentage'>
              <h2>
                  {'$' + price}
              </h2>
              <h2>
                  <VscTriangleDown style={coinDetails.market_data.price_change_percentage_24h < 0 ? '' : {transform: 'rotate(180deg)'}}/>{" " + Math.abs(coinDetails.market_data.price_change_percentage_24h).toFixed(2) + "%"}
              </h2>
            </div>
        </div>     
    )
}

export default Titles
