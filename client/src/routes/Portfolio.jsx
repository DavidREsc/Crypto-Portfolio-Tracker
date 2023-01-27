import React, {useEffect, useState} from 'react';
import '../styles/portfolio.css';
import Sidebar from '../components/portfolio/Sidebar';
import { usePortfolio } from '../contexts/PortfolioContext';
import PortfolioTransactions from '../components/portfolio/PortfolioTransactions';
import { GlobalStyle } from '../styles/Global.styled';

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
        window.scrollTo(0, 0)
    }

    const showPortfolioTable = () => {
        setTransactionsDisplay(false)
        setContentDisplay(true)
    }

    const handleSidebar = () => {
        setSidebarActive(prevState => !prevState)
    }

    return (
            <div className='portfolio-page'>
                {portfolios && transactions && currentPortfolio &&
                <div className='portfolio-page-content'>
                    <GlobalStyle click={sidebarActive}/>
                    {!transactionsDisplay && <button className='mobile-cur-portfolio' onClick={handleSidebar}>
                        {currentPortfolio.portfolio_name} 
                    </button>}
                    <Sidebar active={sidebarActive} handleSidebar={handleSidebar} showPortfolioTable={showPortfolioTable}/>
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
