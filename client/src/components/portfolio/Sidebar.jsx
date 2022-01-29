import React from 'react'

const Sidebar = () => {
    return (
        <div className='side-bar'>
            <div className='all-portfolios-container'>All Portfolios</div>
            <div className='portfolio-list-container'>
                <ul className='portfolio-list'>
                    <li className='portfolio-list-item'>Portfolio 1</li>
                    <li className='portfolio-list-item'>Portfolio 2</li>
                    <li className='portfolio-list-item'>Portfolio 3</li>
                    <li className='portfolio-list-item'>Portfolio 4</li>
                    <li className='portfolio-list-item'>Portfolio 5</li>
                    <li className='portfolio-list-item'>Portfolio 6</li>
                </ul>
            </div>
            <div className='create-portfolio-container'>
                <button className='create-portfolio-btn'>Create Portfolio</button>
            </div>
        </div>
    )
}

export default Sidebar
