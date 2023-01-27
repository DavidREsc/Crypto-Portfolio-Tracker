import React from 'react'
import {formatNumberV2} from '../../utils/formatData';

// Coin statistics - beside chart
const Details = (props) => {

    const {coinDetails} = props;

    return (
        coinDetails &&
        <ul className='coin-details'>
            <h2 className='details-title'>Statistics</h2>
            <li>NAME:<div>{coinDetails.name}</div></li>
            <li>RANK:<div>{coinDetails.rank}</div></li>
            <li>PRICE:<div>{'$' + formatNumberV2(coinDetails.price)}</div></li>
            <li>ATH:<div>{'$' + formatNumberV2(coinDetails.allTimeHigh.price)}</div></li>
            <li>MARKET CAP:<div>{'$' + formatNumberV2(coinDetails.marketCap)} </div></li>
            <li>AVAILABLE SUPPLY:<div>{formatNumberV2(coinDetails.supply.circulating)}</div></li>
            <li>24H CHANGE:<div>{coinDetails.change + ' %'}</div></li>
        </ul>
    )
}

export default Details
