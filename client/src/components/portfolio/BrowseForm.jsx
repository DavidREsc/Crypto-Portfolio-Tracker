import React, {useState} from 'react';
import { useAssets } from '../../contexts/AssetsContext';
import {MdClose} from 'react-icons/md';

// Form for browsing and selecting assets
const BrowseForm = (props) => {
    const {handleSubmit, reference, closeForm} = props;
    const [searchTerm, setSearchTerm] = useState("");
    const {assets} = useAssets();

    return (
      <div className='overlay'>
        <div ref={reference} className='browse-form-container-parent'>
            <button className='browse-form-icon' onClick={closeForm}><MdClose /></button>
            <h3 style={{marginBottom: '1rem'}}>Select Coin</h3>
            <input
              placeholder='Search...'
              type='text'
              className='browse-form-searchbar'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}>
            </input>

            <div className='browse-form-container'>
                <form className='browse-form'>
                {/* Show results as user enters new characters. If nothing
                is entered, show top 200 assets. */}
                    {assets.filter(asset => {
                        if (!searchTerm) return asset;
                        // Matches entered characters to asset name or symbol
                        else return (asset.name.toLowerCase().includes(searchTerm.toLowerCase()
                                     || asset.symbol.includes(searchTerm)));
                    }).slice(0,200).map((asset, idx) => {
                        return (<button type='button' onClick={handleSubmit} data-asset={asset.name} className='browse-form-btn' key={idx}>
                                  <div className='browse-form-btn-div'>
                                    <img className ='coin-img' src={asset.iconUrl} alt={asset.name}></img>
                                    <p>{asset.name}</p>
                                    <p className='browse-form-btn-div-symbol'>{asset.symbol.toUpperCase()}</p>
                                  </div>
                                </button>)
                    })}
                </form>
            </div>
        </div>
      </div>
    )
};

export default BrowseForm;
