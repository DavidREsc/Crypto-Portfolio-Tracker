import React, {useState} from 'react';
import '../../styles/header.css';
import { NavIcon, NavBtn, NavContainer, MobileIcon, NavLinks, NavLogoContainer, NavLogo } from '../../styles/Header.styled';
import { FaBars, FaTimes } from 'react-icons/fa';
import { GlobalStyle } from '../../styles/Global.styled';
import { useAuth } from '../../contexts/AuthContext';

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
                Crypto Manager
    
            </NavLogoContainer>
            <MobileIcon onClick={handleClick}>
                {click ? <FaTimes/> : <FaBars/>}
            </MobileIcon>
            <NavContainer onClick={handleClick} click={click}>  
                <NavLinks to='/'>Home</NavLinks>       
                <NavLinks  to='/portfolio'>Portfolio</NavLinks>
                <NavLinks  to='/browse'>Browse</NavLinks>
                <NavIcon >|</NavIcon>       
                <NavLinks to='/source'>Source</NavLinks>  
                {user ? <NavBtn onClick={logout} >Log Out</NavBtn> : <NavLinks to='/sign-in'>Sign In</NavLinks>}    
            </NavContainer>        
        </>
    )
}

export default NavBar
