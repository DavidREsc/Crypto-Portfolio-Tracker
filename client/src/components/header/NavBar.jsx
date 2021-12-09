import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/header.css';

const NavBar = () => {
    return (
        <div className='navbar'>
            <Link className='link' to='/'>Home</Link>
            <Link className='link' to='/portfolio'>Portfolio</Link>
            <Link className='link' to='/browse'>Browse</Link>
            |
            <Link className='source-btn' to='/source'>Source</Link>
        </div>
    )
}

export default NavBar
