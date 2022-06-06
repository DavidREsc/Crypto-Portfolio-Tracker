import React from 'react';
import '../styles/app.css';
import '../styles/home.css';
import { useAssets } from '../contexts/AssetsContext';
import CoinList from '../components/browse/CoinList';

const Home = () => {
    const {stats} = useAssets();
    const formatNumber = (price) => {
        price = parseFloat(price);
        if (price === null) price = 'Unlimited';
        else if (price > 1 ) price = price.toLocaleString(undefined, {maximumFractionDigits: 2});
        else if (price < 1 && price > 0.0001) price = price.toLocaleString(undefined, {minimumFractionDigits: 4});
        else price = price.toLocaleString(undefined, {minimumFractionDigits: 8});
        return price;
    }
    return (
        <div className='home-page'>
            <div className='home-stats-container'>
                <h2 className='home-stats-title'>Global Crypto Statistics</h2>
                <div className='stats'>
                  <dl>
                    <div className='stat'>
                      <dt className='stat-label'>Total Cryptocurrencies</dt>
                      <dd>{formatNumber(stats.totalCoins)}</dd>
                    </div>
                    <div className='stat'>
                      <dt className='stat-label'>Total Maket Cap</dt>
                      <dd>{'$' + formatNumber(stats.totalMarketCap)}</dd>
                    </div>
                    <div className='stat'>
                      <dt className='stat-label'>Total Markets</dt>
                      <dd>{formatNumber(stats.totalMarkets)}</dd>
                    </div>
                  </dl>
                  <dl>
                    <div className='stat'>
                      <dt className='stat-label'>Total Exchanges</dt>
                      <dd>{stats.totalExchanges}</dd>
                    </div>
                    <div className='stat'>
                      <dt className='stat-label'>Total 24h Volume</dt>
                      <dd>{'$' + formatNumber(stats.total24hVolume)}</dd>
                    </div>
                  </dl>
                </div>
            </div>
            <div className='top-crypto-container'>
                <h2 className='top-crypto-title'>Top 20 Cryptocurrencies</h2>
                <CoinList limit={20} className='top-crypto'/>
            </div>
        </div>
    )
}

export default Home
