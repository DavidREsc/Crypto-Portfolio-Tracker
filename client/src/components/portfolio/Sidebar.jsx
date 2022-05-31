import React from 'react';
import {AiFillDelete} from 'react-icons/ai';

const Sidebar = (props) => {
    const {data, handleCreatePortfolio, selectPortfolio, handleDeletePortfolio} = props;
    return (
        <div className='side-bar'>
            <div className='all-portfolios-container'>All Portfolios</div>
            <div className='portfolio-list-container'>
                <ul className='portfolio-list'>
                    {data.map((p, idx) => {
                        return (
                            <li key={idx} className='portfolio-list-item'>
                              <button className='portfolio-list-item-btn' onClick={() => selectPortfolio(p)}>
                                {p.portfolio_name}
                              </button>
                              <div>
                                 <button className='delete-portfolio-btn' onClick={() => handleDeletePortfolio(p)}>
                                     <AiFillDelete style={{fontSize: '1rem'}}/>
                                 </button>
                              </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div className='create-portfolio-container'>
                <button className='create-portfolio-btn' onClick={handleCreatePortfolio}>
                    Create Portfolio
                </button>
            </div>
        </div>
    )
}

export default Sidebar
