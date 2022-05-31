import React, { useEffect, useState } from 'react'
import { useAssets } from '../../contexts/AssetsContext';
import {VscTriangleDown} from 'react-icons/vsc';
import {IoMdCloseCircle} from 'react-icons/io';
import {IoIosAddCircle} from 'react-icons/io';

const Content = (props) => {
    const {handleAddAsset, handleDeleteAsset, handleTransactions, transactions, currentPortfolio} = props;
    const [totalWorth, setTotalWorth] = useState(0);
    const [totalChange, setTotalChange] = useState(0);
    const [userAssets, setUserAssets] = useState();
    const [loading, setLoading] = useState(true);
    const {assets} = useAssets();

    useEffect(() => {
        let worth = 0;
        let initial = 0;
        let change = 0;
        let userAssets_;
        if (transactions.length) {
            userAssets_ = transactions.filter(t => t.portfolio_id === currentPortfolio.portfolio_id);
            // total worth and percent change
            if (userAssets_.length) {
              for (let i = 0; i < userAssets_.length; i++) {
                  worth += userAssets_[i].asset_amount * userAssets_[i].price;
                  initial += userAssets_[i].asset_amount * userAssets_[i].initial_price;
              }
              change = (((worth - initial) / Math.abs(initial)) * 100).toFixed(2);
            }

            userAssets_ = userAssets_.map(t => {
                const profitLossUnf = (t.price - t.initial_price) * t.asset_amount;
                const holdings = (t.asset_amount * t.price);
                const initialHoldings = (t.asset_amount * t.initial_price);
                return {
                    ...t,
                    profitLossUnf,
                    holdings,
                    initialHoldings
                }
            })
            userAssets_ = mergeUserAssets(userAssets_)
            userAssets_.sort(compare)
        }
        setUserAssets(userAssets_);
        setTotalWorth(worth);
        setTotalChange(change);
        setLoading(false);
    },[transactions, assets, currentPortfolio])

    const formatNumber = (price) => {
        price = parseFloat(price);
        if (price === null) price = 'Unlimited';
        else if (price >= 1 ) price = price.toLocaleString(undefined, {maximumFractionDigits: 2});
        else if (price <= 0) price = price.toLocaleString(undefined, {maximumFractionDigits: 2});
        else if (price < 1 && price > 0.0001) price = price.toLocaleString(undefined, {minimumFractionDigits: 4});
        else price = price.toLocaleString(undefined, {minimumFractionDigits: 8});
        return price;
    }

    const mergeUserAssets = (a) => {
        let mergedUserAssets = a.reduce((accumulator, cur) => {
            let uuid = cur.uuid, found = accumulator.find(elem => {
                return elem.uuid === uuid
            });
            if (found) {
                found.profitLossUnf += cur.profitLossUnf;
                found.holdings += cur.holdings;
                found.initialHoldings += cur.initialHoldings;
                found.asset_amount += cur.asset_amount;
            }
            else accumulator.push(cur);
            return accumulator;
        }, []);
        return mergedUserAssets;
    }

    const compare = (a, b) => {
        if (a.holdings < b.holdings) return 1;
        if (a.holdings > b.holdings) return -1;
        return 0;
    }

    return (
        <div className='portfolio-content'>
          {!loading && <>
            <div className='total-asset-worth-container'>
                <h2 style={totalChange < 0 ? {backgroundColor: 'red'} : {backgroundColor: 'green'}} className='total-worth'>{'$' + formatNumber(totalWorth)}</h2>
                <div className='total-change' style={totalChange < 0 ? {color: 'red'} : {color: 'green'}}>
                    <VscTriangleDown style={totalChange < 0 ? '' : {transform: 'rotate(180deg)'}}/>
                    <h3>{Math.abs(totalChange).toFixed(2) + '%'}</h3>
                </div>
            </div>
            <div className='asset-title-container'>Your Assets</div>
            <div className='asset-table-container'>
                <table className='asset-table'>
                    <thead>
                        <tr>
                            <th className='first-header'>Name</th>
                            <th>Price</th>
                            <th>24h</th>
                            <th>Holdings</th>
                            <th>Profit/Loss</th>
                            <th className='last-header'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userAssets && userAssets.map((asset, idx) => {
                            const profitLoss = formatNumber(Math.abs(asset.profitLossUnf));
                            return (
                                <tr key={idx}>
                                    <td className='first-td'>
                                        <img className='content-asset-img' src={asset.iconUrl} alt={asset.name}></img>
                                        {asset.name}
                                    </td>
                                    <td>{'$' + formatNumber(asset.price)}</td>
                                    <td style={asset.change < 0 ? {color: 'red'} : {color: 'green'}}>
                                        <VscTriangleDown style={asset.change < 0 ? '' : {transform: 'rotate(180deg)'}}/>
                                        {Math.abs(asset.change).toFixed(2) + '%'}
                                    </td>
                                    <td>
                                        <div>
                                            {'$' + formatNumber(asset.holdings)}
                                            <p className='holdings'>{formatNumber(asset.asset_amount) + " " + asset.symbol}</p>
                                        </div>
                                    </td>
                                    <td style={asset.profitLossUnf < 0 ? {color: 'red'} : {color: 'green'}}>
                                        {'$' + profitLoss}
                                        <div className='profit-loss'>
                                            <VscTriangleDown style={asset.profitLossUnf < 0 ? '' : {transform: 'rotate(180deg)'}}/>
                                            {formatNumber(Math.abs(((1 - (asset.holdings / asset.initialHoldings)) * 100))) + '%'}
                                        </div>
                                    </td>
                                    <td className='last-td'>
                                        <div className='actions'>
                                            <button className='edit-transaction' onClick={() => handleTransactions(asset)}>
                                                <IoIosAddCircle className='edit-transaction-icon'/>
                                            </button>
                                            <button className='delete-asset' onClick={() => handleDeleteAsset(asset)}>
                                                <IoMdCloseCircle className='delete-asset-icon' />
                                            </button>
                    
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
            <div className='add-asset-container'>
                <button onClick={handleAddAsset} className='add-asset-btn'>Add Transaction</button>
            </div>
            </>
          }
        </div>
    )
}

export default Content
