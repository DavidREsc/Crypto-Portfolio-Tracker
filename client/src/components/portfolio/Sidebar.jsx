import React, { useEffect, useState} from 'react';
import {AiFillDelete} from 'react-icons/ai';

//Sidebar containing portfolios, create portfolio button
const Sidebar = (props) => {
    const {data, handleCreatePortfolio, selectPortfolio, handleDeletePortfolio} = props;
    const [selected, setSelected] = useState();

    // Selects portfolio 'Main' on mount
    useEffect(() => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].main) setSelected(i);
        }
    }, [data])

    // Function handler for selecting different portfolios
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
                        // Change style for selected portfolio
                        if (idx === selected) className = 'portfolio-list-item-active';
                        else className = 'portfolio-list-item'
                        return (
                            <li key={idx} className={className}>
                              <button className='portfolio-list-item-btn' onClick={(e) => handleSelectPortfolio(p, idx)}>
                                {p.portfolio_name}
                              </button>
                              <div>
                                {/* Button for deleting a portfolio except if 'Main'*/}
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
                {/* Button for creating a new portfolio */}
                <button className='create-portfolio-btn' onClick={handleCreatePortfolio}>
                    Create Portfolio
                </button>
            </div>
        </div>
    )
}

export default Sidebar
