import React from 'react'

const Titles = (props) => {

const {coinDetails} = props;  
   return (
        <div>
         {coinDetails.length !== 0 &&
            <h1>{coinDetails.name}
                {coinDetails.symbol.toUpperCase()}
                {coinDetails.market_data.current_price.cad.toLocaleString()}
                {Math.abs(coinDetails.market_data.price_change_percentage_24h).toFixed(2)}
            </h1>}
        </div>
    )
}

export default Titles
