import React from 'react'
import '../../styles/coindetails.css';

const Titles = (props) => {

   const {coinDetails} = props; 

    return (
        coinDetails.length !== 0 &&  
        <div className='titles'>
            <h1 className='name-symbol' >
                {coinDetails.name + " " +
                coinDetails.symbol.toUpperCase()}
                <img className='coin-title-img' src={coinDetails.image.small} alt={coinDetails.name}></img>
            </h1>
        </div>     
    )
}

export default Titles
