import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import {MdClose} from 'react-icons/md';
import { useAssets } from '../../contexts/AssetsContext';

// Form to search for specific coins
const SearchCoins = (props) => {
    const {closeForm, reference} = props;
    const [searchTerm, setSearchTerm] = useState("");
    const {assets} = useAssets();

    return (
        <div ref={reference} className='search-container-parent'>
            <input className='search-bar'
              type="text"
              placeholder="Search.." 
              onChange={(e) => setSearchTerm(e.target.value)} 
              value={searchTerm}></input>
            <button className='browse-form-icon' onClick={closeForm}><MdClose /></button>

            <div className='search-container'>
              <form className='search-form'>
                {/* Show results as user enters new characters. If nothing
                is entered, show top 200 assets. */}
                {assets && assets.filter(asset => {
                    if (!searchTerm) return assets;
                    // Matches entered characters to asset name or symbol
                    else return (asset.name.toLowerCase().includes(searchTerm.toLowerCase()
                                 || asset.symbol.includes(searchTerm)));
                }).slice(0,200).map((asset, idx) => {
                  return (
                    <Link key={idx} className='search-link' to={`/browse/${asset.uuid}`}>
                          <div className='result-coin-name-img'>
                              <img className='coin-search-img' src={asset.iconUrl} alt={asset.name}></img>
                              {asset.name}
                          </div>
                          <div className='search-result-rank'>
                            {'#' + asset.rank}
                          </div>
                    </Link>
                  )
                })}
              </form>
            </div>
        </div>
    )
}

export default SearchCoins
