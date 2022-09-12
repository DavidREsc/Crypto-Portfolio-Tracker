import React from 'react'
import {AiFillDelete} from 'react-icons/ai'

const PortfolioList = (props) => {
    const {portfolios, handleSelectPortfolio, showDeletePortfolioForm, currentPortfolio} = props
  return (
    <div className='portfolio-list-container'>
        <ul className='portfolio-list'>
            {portfolios.map((p, idx) => {
                let className;
                // Change style for selected portfolio
                if (p.portfolio_id === currentPortfolio.portfolio_id) className = 'portfolio-list-item-active';
                else className = 'portfolio-list-item'
                return (
                    <li key={idx} className={className}>
                        <button className='portfolio-list-item-btn' onClick={(e) => handleSelectPortfolio(p)}>
                            {p.portfolio_name} 
                        </button>
                        <div>
                            {/* Button for deleting a portfolio except if 'Main'*/}
                            <button className='delete-portfolio-btn' onClick={() => showDeletePortfolioForm(p)}>
                                {p.main ? null : <AiFillDelete style={{fontSize: '1rem'}}/>}
                            </button>
                        </div>
                    </li>
                )
            })}
        </ul>
    </div>
  )
}

export default PortfolioList