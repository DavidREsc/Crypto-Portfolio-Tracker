import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/browse.css';
import {VscTriangleDown} from 'react-icons/vsc';
import formatData from '../../utils/formatData';
import { useAssets } from '../../contexts/AssetsContext';

// Displays coin data
const CoinList = (props) => {

    const {limit, className} = props;
    const {assets} = useAssets();

    return (
        <div className={className}>
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
                        // Format price decimal places
                        let price = formatData.formatNumberV2(coin.price)
                        return (
                            <tr key={idx}>
                                <td>{idx+1}</td>
                                <td className='coin-name'> <Link className='coin-link' to={`/browse/${coin.uuid}`}> <img className='coin-img' src={coin.iconUrl} alt={coin.name}></img>{coin.name}</Link></td>
                                <td><Link className='coin-link' to={`/browse/${coin.uuid}`}>{coin.symbol.toUpperCase()}</Link></td>
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
