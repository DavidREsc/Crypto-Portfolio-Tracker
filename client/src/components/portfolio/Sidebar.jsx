import React from 'react'

const Sidebar = (props) => {
    const {data} = props;
    return (
        <div className='side-bar'>
            <div className='all-portfolios-container'>All Portfolios</div>
            <div className='portfolio-list-container'>
                <ul className='portfolio-list'>
                    {data.portfolios.map((p, idx) => {
                        return (
                            <li key={idx} className='portfolio-list-item'>{p.portfolio_name}</li>
                        )
                    })}
                </ul>
            </div>
            <div className='create-portfolio-container'>
                <button className='create-portfolio-btn'>Create Portfolio</button>
            </div>
        </div>
    )
}

export default Sidebar
