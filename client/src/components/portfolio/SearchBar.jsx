import React from 'react'

const SearchBar = (props) => {
    const {searchInput, handleSearchInput} = props;
  return (
    <input type='text' value={searchInput} onChange={handleSearchInput} className='browse-form-searchbar'></input>
  )
}

export default SearchBar