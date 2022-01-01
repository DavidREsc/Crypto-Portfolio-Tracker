import React from 'react'

const SearchCoins = (props) => {
    const {handleSearch, value, searchResults, onClick} = props;
    return (
        <div className='search-container'>
            <input className='search-bar' type="text" placeholder="Search.." onChange={handleSearch} value={value}></input>
            {searchResults && searchResults.map((result, idx) => {
                return (
                    <li onClick={() => onClick(result.id)} className='search-results' key={idx}>
                        <div>
                            <img className='coin-search-img' src={result.image} alt={result.name}></img>
                            {result.name}
                        </div>
                    </li>
                )
            })}
        </div>
    )
}

export default SearchCoins
