import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AiOutlineApartment } from 'react-icons/ai';

export const NavLogoContainer = styled(Link)`
    color: #e8e8e8;
    justify-self: flex-start;
    cursor: pointer;
    text-decoration: none;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
`

export const NavLogo = styled(AiOutlineApartment)`
    margin-right: 0.5rem;
    margin-left: 2rem;
`

export const NavContainer = styled.div`
    display: flex;
	margin-right: 5%;
	color: #e8e8e8;
    background-color: #0a090c;

    @media screen and (max-width: 960px) {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        position: absolute;
        top: 3rem;
        left: ${({click}) => (click ? 0 : '-100%')};
        opacity: 1;
        transition: all 0.5s ease;
    }
`

export const NavIcon = styled.div`
    display: inline-block;
    user-select: none;   
    margin-right: 2rem;

    @media screen and (max-width: 960px) {
        display: none;
    }
`

export const MobileIcon = styled.div`
    display: none;
    color: #e8e8e8;

    @media screen and (max-width: 960px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 30%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`
export const NavLinks = styled(Link)`
    color: #e8e8e8;
	text-decoration: none;
	margin-right: 2rem;

    &:hover {
        text-decoration: underline;
	    color: rgba(255, 255, 255, 1);
    }

    @media screen and (max-width: 960px) {
        text-align: center;
        padding:2rem;
        width: 100%;
        font-size: 1.5rem;
        
        &:hover {
            text-decoration: none;
            transition: all 0.3 ease;
        }
    }
`

export const NavBtn = styled.button`
    color: #e8e8e8;
	background: none;
    border: none;
    cursor: pointer;
	margin-right: 2rem;
    font-size: 1rem;

    &:hover {
        text-decoration: underline;
	    color: #e8e8e8;
    }

    @media screen and (max-width: 960px) {
        text-align: center;
        padding:2rem;
        width: 100%;
        font-size: 1.5rem;
        
        &:hover {
            transition: all 0.3 ease;
        }
    }
`
