import React, {useRef, useEffect, useState} from 'react'
import { Link } from 'react-router-dom';

const SearchCoins = (props) => {
    const {handleSearch, value, searchResults} = props;
    const [dropDown, setDropDown] = useState();
    const dropDownRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', closeDropDown);
    });

    const closeDropDown = (e) => {
        if (dropDownRef.current && dropDown && !dropDownRef.current.contains(e.target)) {
            setDropDown(false);
        }
    }

    const openDropDown = () => {
        setDropDown(true);
    }

    return (
        <div ref={dropDownRef} onClick={openDropDown} className='search-container'>
            <input className='search-bar' type="text" placeholder="Search.." onChange={handleSearch} value={value}></input>
            {searchResults && searchResults.map((result, idx) => {
                return ( dropDown && 
                  <Link key={idx} className='search-link' to={`/browse/${result.id}`}>
                    <li className='search-results'>
                        <div>
                            <img className='coin-search-img' src={result.image} alt={result.name}></img>
                            {result.name}
                        </div>
                    </li>
                  </Link>
                )
            })}
        </div>
    )
}

export default SearchCoins
