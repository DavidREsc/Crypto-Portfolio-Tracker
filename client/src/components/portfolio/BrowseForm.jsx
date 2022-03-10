import React from 'react';
import { useAssets } from '../../contexts/AssetsContext';

const BrowseForm = (props) => {
    const {handleSubmit, handleSearchTerm, searchTerm, reference} = props;
    const {assets} = useAssets();

    return (
        <div ref={reference} className='browse-form-container-parent'>
            <input
              placeholder='Search'
              type='text'
              className='browse-form-searchbar'
              value={searchTerm}
              onChange={handleSearchTerm}>
            </input>
            <div className='browse-form-container'>
                <form className='browse-form'>
                    {assets.filter(asset => {
                        if (!searchTerm) return asset;
                        else return (asset.name.toLowerCase().includes(searchTerm.toLowerCase()
                                     || asset.symbol.includes(searchTerm)));
                    }).slice(0,300).map((asset, idx) => {
                        return (<button type='button' onClick={handleSubmit} data-asset={asset.name} className='browse-form-btn' key={idx}>
                                  <div className='browse-form-btn-div'>
                                    <img className ='coin-img' src={asset.image} alt={asset.name}></img>
                                    <p>{asset.name}</p>
                                    <p className='browse-form-btn-div-symbol'>{asset.symbol.toUpperCase()}</p>
                                  </div>
                                </button>)
                    })}
                </form>
            </div>
        </div>
    )
};

export default BrowseForm;
