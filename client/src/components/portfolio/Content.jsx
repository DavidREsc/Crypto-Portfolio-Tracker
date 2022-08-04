import React, { useEffect, useState } from 'react'
import { useAssets } from '../../contexts/AssetsContext';
import {VscTriangleDown} from 'react-icons/vsc';
import {IoMdCloseCircle} from 'react-icons/io';
import {IoIosAddCircle} from 'react-icons/io';
import formatData from '../../utils/formatData';

// Main content on portfolio page. Shows data of user transactions in current portfolio
const Content = (props) => {
    const {handleAddAsset, handleDeleteAsset, handleTransactions, transactions, currentPortfolio} = props;
    const [totalWorth, setTotalWorth] = useState(0);
    const [totalChange, setTotalChange] = useState(0);
    const [curPortfolioAssets, setCurPortfolioAssets] = useState();
    const [loading, setLoading] = useState(true);
    const {assets} = useAssets();

    useEffect(() => {
        let worth = 0;
        let initial = 0;
        let change = 0;
        let curPortfolioAssets = [];
        if (transactions.length) {
            // filter for assets in current portfolio
            curPortfolioAssets = transactions.filter(t => t.portfolio_id === currentPortfolio.portfolio_id);

            // calculate total worth and percent change
            if (curPortfolioAssets.length) {
              for (let i = 0; i < curPortfolioAssets.length; i++) {
                  worth += curPortfolioAssets[i].asset_amount * curPortfolioAssets[i].price;
                  initial += curPortfolioAssets[i].asset_amount * curPortfolioAssets[i].initial_price;
              }
              change = (((worth - initial) / Math.abs(initial)) * 100).toFixed(2);
            }
            // calculate profit/loss, holdings and initial holdings in dollars
            curPortfolioAssets = formatData.calculateProfitLossHoldings(curPortfolioAssets)
            // merge transactions
            curPortfolioAssets = formatData.mergeTransactions(curPortfolioAssets)
            // sort assets from greatest to least in holdings amount
            curPortfolioAssets.sort(formatData.sortAssets)
        }
        setCurPortfolioAssets(curPortfolioAssets);
        setTotalWorth(worth);
        setTotalChange(change);
        setLoading(false);
    },[transactions, assets, currentPortfolio])

    return (
        <div className='portfolio-content'>
          {!loading && <>
          {/* Portfolio total worth and percent change */}
            <div className='total-asset-worth-container'>
                <div className='balance-container'>
                  <p className='current-balance'>Current balance</p>
                  <h2 style={totalChange < 0 ? {backgroundColor: 'red'} : {backgroundColor: 'green'}} className='total-worth'>{'$' + formatData.formatNumber(totalWorth)}</h2>
                </div>
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
                        {curPortfolioAssets && curPortfolioAssets.map((asset, idx) => {
                            // Format decimal places for profit/loss
                            const profitLoss = formatData.formatNumber(Math.abs(asset.profitLossUnf));
                            return (
                                <tr key={idx}>
                                    {/* Asset name column */}
                                    <td className='first-td'>
                                        <img className='content-asset-img' src={asset.iconUrl} alt={asset.name}></img>
                                        {asset.name}
                                    </td>

                                    {/* Current asset price column */}
                                    <td>{'$' + formatData.formatNumber(asset.price)}</td>

                                    {/* 1d percent change column */}
                                    <td style={asset.change < 0 ? {color: 'red'} : {color: 'green'}}>
                                        <VscTriangleDown style={asset.change < 0 ? '' : {transform: 'rotate(180deg)'}}/>
                                        {Math.abs(asset.change).toFixed(2) + '%'}
                                    </td>

                                    {/* Asset holdings (dollar amount and coin amount) */}
                                    <td>
                                        <div>
                                            {'$' + formatData.formatNumber(asset.holdings)}
                                            <p className='holdings'>{asset.asset_amount + " " + asset.symbol}</p>
                                        </div>
                                    </td>

                                    {/* Profit/loss columns */}
                                    <td style={asset.profitLossUnf < 0 ? {color: 'red'} : {color: 'green'}}>
                                        {'$' + profitLoss}
                                        <div className='profit-loss'>
                                            <VscTriangleDown style={asset.profitLossUnf < 0 ? '' : {transform: 'rotate(180deg)'}}/>
                                            {Math.abs(((1 - (asset.holdings / asset.initialHoldings)) * 100)).toFixed(2) + '%'}
                                        </div>
                                    </td>

                                    {/* Actions columns */}
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
      
            {/* Button for adding a new asset/transaction */}
            <div className='add-asset-container'>
                <button onClick={handleAddAsset} className='add-asset-btn'>Add Asset</button>
            </div>
            </>
          }
        </div>
    )
}

export default Content
