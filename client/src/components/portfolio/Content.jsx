import React, { useEffect, useState } from 'react'
import { useAssets } from '../../contexts/AssetsContext';

const Content = (props) => {
    const {handleAddAsset, data} = props;
    const [userAssets, setUserAssets] = useState();
    const {assets} = useAssets();


   useEffect(() => {
        for (let  i = 0; i < data.length; i++) {
            //console.log(data[i]);
        }
    },[data])


    return (
        <div className='portfolio-content'>
            <div className='total-asset-worth-container'>Total Worth</div>
            <div className='asset-title-container'>Your Cryptocurrencies</div>
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
                        {data.map((d, idx) => {
                            return (
                                <tr key={idx}>
                                  <td className='first-td'>{assets.filter(asset => asset.uuid === d.asset_coin_id)[0].name}</td>
                                  <td>{"$" + assets.filter(asset => asset.uuid === d.asset_coin_id)[0].price}</td>
                                  <td>{parseFloat(assets.filter(asset => asset.uuid === d.asset_coin_id)[0].change).toFixed(2) + "%"}</td>
                                  <td>{"$" + (assets.filter(asset => asset.uuid === d.asset_coin_id)[0].price * d.asset_amount).toFixed(2)}</td>
                                  <td>{"$" + ((assets.filter(asset => asset.uuid === d.asset_coin_id)[0].price - d.initial_price) * d.asset_amount).toFixed(2)}</td>
                                  <td className='last-td'>+ -</td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
            <div className='add-asset-container'>
                <button onClick={handleAddAsset} className='add-asset-btn'>Add Cryptocurrency</button>
            </div>
        </div>
    )
}

export default Content
