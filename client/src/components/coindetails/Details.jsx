import React from 'react'

const Details = (props) => {

    const {coinDetails, formatNumber} = props;

    return (
        coinDetails &&
        <ul className='coin-details'>
            <h2 className='details-title'>Statistics</h2>
            <li>NAME:<div>{coinDetails.name}</div></li>
            <li>RANK:<div>{coinDetails.rank}</div></li>
            <li>PRICE:<div>{'$' + formatNumber(coinDetails.price)}</div></li>
            <li>ATH:<div>{'$' + formatNumber(coinDetails.allTimeHigh.price)}</div></li>
            <li>MARKET CAP:<div>{'$' + formatNumber(coinDetails.marketCap)} </div></li>
            <li>AVAILABLE SUPPLY:<div>{formatNumber(coinDetails.supply.circulating)}</div></li>
            <li>24H CHANGE:<div>{coinDetails.change + ' %'}</div></li>
        </ul>
    )
}

export default Details
