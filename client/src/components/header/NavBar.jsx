import React, {useState} from 'react';
import '../../styles/header.css';
import { NavIcon, NavContainer, MobileIcon, NavLinks, NavLogoContainer, NavLogo } from '../../styles/Header.styled';
import { FaBars, FaTimes } from 'react-icons/fa';
import { GlobalStyle } from '../../styles/Global.styled';

const NavBar = () => {

    const [click, setClick] = useState(false);

    const handleClick = () => {
        setClick(!click);
    }

    return (
        <>   
            <GlobalStyle click={click}/>
            <NavLogoContainer to='/'>
                <NavLogo/>
                CRYPORT
            </NavLogoContainer>
            <MobileIcon onClick={handleClick}>
                {click ? <FaTimes/> : <FaBars/>}
            </MobileIcon>
            <NavContainer onClick={handleClick} click={click}>         
                <NavLinks  to='/'>Home</NavLinks>
                <NavLinks  to='/portfolio'>Portfolio</NavLinks>
                <NavLinks  to='/browse'>Browse</NavLinks>
                <NavIcon >|</NavIcon>       
                <NavLinks to='/source'>Source</NavLinks>        
            </NavContainer>        
        </>
    )
}

export default NavBar
