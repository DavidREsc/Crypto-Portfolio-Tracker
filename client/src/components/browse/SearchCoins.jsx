import React from 'react'

const SearchCoins = (props) => {
    const {handleSearch, value, searchResults} = props;
    return (
        <div className='search-container'>
            <input className='search-bar' type="text" placeholder="Search.." onChange={handleSearch} value={value}></input>
            {searchResults && searchResults.map(result => {
                return (
                    <li className='search-results' key={result.market_cap_rank}>{result.name}</li>
                )
            })}
        </div>
    )
}

export default SearchCoins
