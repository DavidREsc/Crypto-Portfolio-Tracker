import React from 'react'
import { Link } from 'react-router-dom';

const Card = (props) => {
    const {asset, format} = props;
  return (
    asset &&
    <Link className='card' to={`/browse/${asset.uuid}`}>
        <div className='name-and-symbol'>
            {asset.rank + ". " + asset.name}
            <img className='symbol' src={asset.iconUrl} alt={asset.name}></img>
        </div>
        <div className='card-details-container'>
            <ul className='card-details'>
                <li>
                    {"Price: $" + format(asset.price)}
                </li>
                <li>
                    {"Market Cap: $" + format(asset.marketCap)}
                </li>
                <li>
                    {"Daily Change: " + parseFloat(asset.change).toFixed(2) + " %"}
                </li>
            </ul>
        </div>

    </Link>
  )
}

export default Card