import React from 'react'

const Details = (props) => {

    const {price, ath, atl, marketCap, totalVolume, availableSupply, totalSupply, coinDetails} = props;

    return (
        coinDetails.length !== 0 && coinDetails.market_cap_rank &&
        <ul className='coin-details'>
            <li>PRICE:<div>{'$' + price}</div></li>
            <li>ATH:<div>{'$' + ath}</div></li>
            <li>ATL:<div>{'$' + atl}</div></li>
            <li>MARKET CAP:<div>{'$' + marketCap} </div></li>
            <li>TOTAL VOLUME:<div>{'$' + totalVolume}</div></li>
            <li>AVAILABLE SUPPLY:<div>{availableSupply}</div></li>
            <li>TOTAL SUPPLY:<div>{totalSupply}</div></li>
            <li>% CHANGE 1H:<div>{coinDetails.market_data.price_change_percentage_1h_in_currency.usd.toFixed(2) + '%'}</div></li>
            <li>% CHANGE 1D:<div>{coinDetails.market_data.price_change_percentage_24h.toFixed(2) + '%'}</div></li>
            <li>% CHANGE 7D:<div>{coinDetails.market_data.price_change_percentage_7d.toFixed(2) + '%'}</div></li>
        </ul>
    )
}

export default Details
