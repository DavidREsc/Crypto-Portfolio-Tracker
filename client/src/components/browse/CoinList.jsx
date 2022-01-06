import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/browse.css';
import {VscTriangleDown} from 'react-icons/vsc';


const CoinList = (props) => {

    const {coins, limit} = props;

    return (
        <div className='coin-list'>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Symbol</th>
                        <th>24h</th>
                        <th className='coin-price-header'>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {coins && coins.filter((coin, idx) => idx < limit).map((coin,idx) => {
                        let price = coin.current_price;
                        if (price > 1 ) price = price.toLocaleString();
                        else if (price < 1 && price > 0.0001) price = price.toLocaleString(undefined, {minimumFractionDigits: 4});
                        else price = price.toLocaleString(undefined, {minimumFractionDigits: 8});

                        return (
                            <tr key={idx}>
                                <td>{idx+1}</td>
                                <td className='coin-name'> <Link className='coin-link' to={`/browse/${coin.id}`}> <img className='coin-img' src={coin.image} alt={coin.name}></img>{coin.name}</Link></td>
                                <td>{coin.symbol.toUpperCase()}</td>
                                <td style={coin.price_change_percentage_24h < 0 ? {color:'red'} : {color:'green'}}>
                                    <VscTriangleDown className='icon' style={coin.price_change_percentage_24h < 0 ? '' : {transform: 'rotate(180deg)'}}/>
                                    {Math.abs(coin.price_change_percentage_24h).toFixed(2) + "%"}
                                </td>
                                <td className='coin-price' style={coin.price_change_percentage_24h < 0 ? {color:'red'} : {color:'green'}}>
                                    {'$' + price}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default CoinList
