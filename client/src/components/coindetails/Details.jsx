import React from 'react'

const Details = (props) => {

    const {price, ath, marketCap, availableSupply, totalSupply, coinDetails} = props;

    return (
        coinDetails &&
        <ul className='coin-details'>
            <h2 className='details-title'>Statistics</h2>
            <li>PRICE:<div>{'$' + price}</div></li>
            <li>ATH:<div>{'$' + ath}</div></li>
            <li>MARKET CAP:<div>{'$' + marketCap} </div></li>
            <li>AVAILABLE SUPPLY:<div>{availableSupply}</div></li>
            <li>TOTAL SUPPLY:<div>{totalSupply}</div></li>
        </ul>
    )
}

export default Details
