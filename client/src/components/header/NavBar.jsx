import React, {useState} from 'react';
import '../../styles/header.css';
import { NavIcon, NavBtn, NavContainer, MobileIcon, NavLinks, NavLogoContainer, NavLogo, NavLinkContainer } from '../../styles/Header.styled';
import { FaBars, FaTimes } from 'react-icons/fa';
import { GlobalStyle } from '../../styles/Global.styled';
import { useAuth } from '../../contexts/AuthContext';

// Site navigation
const NavBar = () => {

    const [click, setClick] = useState(false);
    const {user, logout} = useAuth();

    const handleClick = () => {
        setClick(!click);
    }

    return (
        <>   
            <GlobalStyle click={click}/>
            <NavLogoContainer to='/'>
                <NavLogo/>
                CT Portfolio Tracker
    
            </NavLogoContainer>
            <MobileIcon onClick={handleClick}>
                {click ? <FaTimes/> : <FaBars/>}
            </MobileIcon>
            <NavContainer onClick={handleClick} click={click}> 
                <NavLinkContainer>
                  <NavLinks to='/'>Home</NavLinks>       
                  <NavLinks  to='/portfolio'>Portfolio</NavLinks>
                  <NavLinks  to='/browse'>Browse</NavLinks>
                  <NavIcon >|</NavIcon>       
                  <a href='https://github.com/DavidREsc/Crypto-Portfolio-Tracker'
                     target="_blank" 
                     rel="noopener noreferrer"
                     className='source-link'
                     >
                    Source
                  </a>  
                </NavLinkContainer> 
                {user ? <NavBtn onClick={logout} >Log Out</NavBtn> : <NavLinks to='/sign-in'>Sign In</NavLinks>}    
            </NavContainer>        
        </>
    )
}

export default NavBar
