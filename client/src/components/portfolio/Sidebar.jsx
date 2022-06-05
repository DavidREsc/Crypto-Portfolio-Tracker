import React, { useEffect, useState} from 'react';
import {AiFillDelete} from 'react-icons/ai';

const Sidebar = (props) => {
    const {data, handleCreatePortfolio, selectPortfolio, handleDeletePortfolio} = props;
    const [selected, setSelected] = useState();

    useEffect(() => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].main) setSelected(i);
        }
    }, [data])

    const handleSelectPortfolio = (p, idx) => {
        setSelected(idx);
        selectPortfolio(p);
    }

    return (
        <div className='side-bar'>
            <div className='all-portfolios-container'>All Portfolios</div>
            <div className='portfolio-list-container'>
                <ul className='portfolio-list'>
                    {data.map((p, idx) => {
                        let className;
                        if (idx === selected) className = 'portfolio-list-item-active';
                        else className = 'portfolio-list-item'
                        return (
                            <li key={idx} className={className}>
                              <button className='portfolio-list-item-btn' onClick={(e) => handleSelectPortfolio(p, idx)}>
                                {p.portfolio_name}
                              </button>
                              <div>
                                 <button className='delete-portfolio-btn' onClick={() => handleDeletePortfolio(p)}>
                                     {p.main ? null : <AiFillDelete style={{fontSize: '1rem'}}/>}
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
