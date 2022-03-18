import React from 'react'
import '../../styles/coindetails.css';

const Titles = (props) => {

   const {coinDetails} = props; 

    return (
        coinDetails.length !== 0 &&  
        <div className='titles'>
            <h1 className='name-symbol' >
                {coinDetails.name + " " +
                coinDetails.symbol}
                <img className='coin-title-img' src={coinDetails.iconUrl} alt={coinDetails.name}></img>
            </h1>
        </div>     
    )
}

export default Titles
