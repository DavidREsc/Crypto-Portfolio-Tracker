import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AiOutlineApartment } from 'react-icons/ai';

export const NavLogoContainer = styled(Link)`
    color: #fff;
    justify-self: flex-start;
    cursor: pointer;
    text-decoration: none;
    font-size: 1.6rem;
    display: flex;
    align-items: center;
    margin-top: 0.8rem;
`

export const NavLogo = styled(AiOutlineApartment)`
    margin-right: 0.5rem;
    margin-left: 2rem;
`

export const NavContainer = styled.div`
    display: flex;
	margin-top: 1.3rem;
	margin-right: 5%;
	color: white;
    background-color: #101522;

    @media screen and (max-width: 960px) {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        position: absolute;
        top: 2rem;
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
    color: white;

    @media screen and (max-width: 960px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 60%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`
export const NavLinks = styled(Link)`
    color: rgba(255, 255, 255, 0.9);
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
