import React, {useEffect, useState} from 'react';
import '../styles/portfolio.css';
import Sidebar from '../components/portfolio/Sidebar';
import { usePortfolio } from '../contexts/PortfolioContext';
import PortfolioTransactions from '../components/portfolio/PortfolioTransactions';

import PortfolioAssets from '../components/portfolio/PortfolioAssets';


const Portfolio = () => {

    const [contentDisplay, setContentDisplay] = useState(true);
    const [transactionsDisplay, setTransactionsDisplay] = useState(false);
    const [sidebarActive, setSidebarActive] = useState(false)
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

    const handleSidebar = () => {
        setSidebarActive(prevState => !prevState)
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
                    {!transactionsDisplay && <button className='mobile-cur-portfolio' onClick={handleSidebar}>
                        {currentPortfolio.portfolio_name} 
                    </button>}
                    <Sidebar active={sidebarActive} handleSidebar={handleSidebar}/>
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
