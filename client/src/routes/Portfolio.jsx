import React, {useEffect, useState} from 'react';
import '../styles/portfolio.css';
import Sidebar from '../components/portfolio/Sidebar';
import { usePortfolio } from '../contexts/PortfolioContext';
import PortfolioTransactions from '../components/portfolio/PortfolioTransactions';

import PortfolioAssets from '../components/portfolio/PortfolioAssets';


const Portfolio = () => {

    const [contentDisplay, setContentDisplay] = useState(true);
    const [transactionsDisplay, setTransactionsDisplay] = useState(false);
    const {updateSelected, createPortfolio, portfolios, transactions, currentPortfolio} = usePortfolio()

    const showTransactionsTable = (asset) => {
        updateSelected(asset)
        setContentDisplay(false)
        setTransactionsDisplay(true)
    }

    const showPortfolioTable = () => {
        setTransactionsDisplay(false)
        setContentDisplay(true)
    }

    useEffect(() => {
        if (!portfolios.length) {
            createPortfolio('Main', (e) => {
                if (e) console.log(e)
            }, true)
        }
    }, [portfolios, createPortfolio])

    return (
            <div className='portfolio-page'>
                {portfolios && transactions && currentPortfolio &&
                <div className='portfolio-page-content'>
                    <Sidebar/>
                    {contentDisplay && <PortfolioAssets
                        showTransactionsTable={showTransactionsTable}
                    />}
                    {transactionsDisplay && 
                      <PortfolioTransactions
                        showPortfolioTable={showPortfolioTable}
                      />
                    }
                </div>}
            </div> 
    )
}

export default Portfolio
