import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/browse.css';
import {VscTriangleDown} from 'react-icons/vsc';
import { useAssets } from '../../contexts/AssetsContext';


const CoinList = (props) => {

    const {limit} = props;
    const {assets} = useAssets();
    console.log(assets)

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
                    {assets && assets.filter((coin, idx) => idx < limit).map((coin,idx) => {
                        let price = parseFloat(coin.price);
                        if (price >= 1 ) price = price.toLocaleString(undefined, {maximumFractionDigits: 2});
                        else if (price < 1 && price >= 0.0001) price = price.toLocaleString(undefined, {minimumFractionDigits: 4});
                        else if (price < 0.0001 && price > 0.0000001) price = price.toLocaleString(undefined, {minimumFractionDigits: 8});
                        else price = price.toLocaleString(undefined, {minimumFractionDigits: 11})

                        return (
                            <tr key={idx}>
                                <td>{idx+1}</td>
                                <td className='coin-name'> <Link className='coin-link' to={`/browse/${coin.uuid}`}> <img className='coin-img' src={coin.iconUrl} alt={coin.name}></img>{coin.name}</Link></td>
                                <td>{coin.symbol.toUpperCase()}</td>
                                <td style={coin.change < 0 ? {color:'red'} : {color:'green'}}>
                                    <VscTriangleDown className='icon' style={coin.change < 0 ? '' : {transform: 'rotate(180deg)'}}/>
                                    {Math.abs(coin.change).toFixed(2) + "%"}
                                </td>
                                <td className='coin-price' style={coin.change < 0 ? {color:'red'} : {color:'green'}}>
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
