import React, {useState} from 'react';
import { useAssets } from '../../contexts/AssetsContext';
import { TextFieldSearch } from '../../styles/MaterialUi.styled';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CloseFormBtn from '../buttons/CloseFormBtn';


// Form for browsing and selecting assets
const BrowseForm = (props) => {
  const {handleSelect, reference, closeForm} = props;
  const [searchTerm, setSearchTerm] = useState("");
  const {assets} = useAssets();

  return (
    <div className='overlay'>
      <div ref={reference} className='browse-form-container-parent'>
        <div className='trns-form-icons-container'>
          <h3>Select Coin</h3>
          <CloseFormBtn closeForm={closeForm}/>  
        </div>
        <div className='browse-form-searchbar'>
          <TextFieldSearch
            placeholder='Search...'
            fullWidth
            type='text'
            inputRef={input => input && input.focus()}
            
            autoComplete='off'
            size='small'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color='primary' />
                </InputAdornment>
              ),
            }}
          />
        </div>

    <div className='browse-form-container'>
      <form className='browse-form'>
        {/* Show results as user enters new characters. If nothing
          is entered, show top 200 assets. */}
        {assets.filter(asset => {
          if (!searchTerm) return asset; 
            // Matches entered characters to asset name or symbol
            else return (asset.name.toLowerCase().includes(searchTerm.toLowerCase())
                        || asset.symbol.includes(searchTerm.toUpperCase()));
              }).slice(0,200).map((asset, idx) => {
                return (<button type='button' onClick={handleSelect} data-asset={asset.uuid} className='browse-form-btn' key={idx}>
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
