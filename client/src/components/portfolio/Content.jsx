import React from 'react'

const Content = () => {
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
                        <tr>
                            <td className='first-td'>Bitcoinin</td>
                            <td>$54000</td>
                            <td>2.45%</td>
                            <td>$25000</td>
                            <td>$5000</td>
                            <td className='last-td'>+ -</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='add-asset-container'>
                <button className='add-asset-btn'>Add Cryptocurrency</button>
            </div>
        </div>
    )
}

export default Content
