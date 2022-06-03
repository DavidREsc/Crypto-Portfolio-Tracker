import React, {useState, useEffect} from 'react'
import { useAssets } from '../../contexts/AssetsContext';
import {BiArrowBack} from 'react-icons/bi';
import {MdClose} from 'react-icons/md';

const TransactionForm = (props) => {
    const {reference, selectedAsset, addTransaction, handleTrnsBackBtn, closeForm} = props;
    const [quantity, setQuantity] = useState("");
    const [pricePerCoin, setPricePerCoin] = useState("");
    const {assets} = useAssets();

    useEffect(() => {
      setPricePerCoin(() => {
        return assets.filter(asset => asset.name === selectedAsset)[0].price
      });
    },[assets, selectedAsset]);

    const handleSubmit = (e) => {
      e.preventDefault();
      addTransaction(parseFloat(quantity), parseFloat(pricePerCoin));
    }

  return (
   <div className='overlay'>
    <div ref={reference} className='transaction-form-container-parent'>
      <div className='transaction-form-container'>
        <div className='trns-form-icons-container'>
          <button className='trns-form-icons' onClick={handleTrnsBackBtn}><BiArrowBack/></button>
          <button className='trns-form-icons' onClick={closeForm}><MdClose className='trns-form-icons'/></button>
        </div>
        <h3 className='trns-form-title'>Add Transaction</h3>
        <div className='trns-form-asset-name-input'>
          <img 
            className='coin-img'
            src={assets.filter(asset => asset.name === selectedAsset)[0].iconUrl}
            alt={selectedAsset}>
          </img>
          <p>{selectedAsset}</p>
        </div>
        <form className='transaction-form' onSubmit={handleSubmit}>
          <div className='trns-form-details-label-container'>
            <label className="trns-form-asset-details-label"> Quantity</label>
            <label className="trns-form-asset-details-label"> Price Per Coin</label>
          </div>
          <div className="trns-form-details-input-container">
            <input className='trns-form-asset-details-input' autoFocus required
              placeholder='0.00'
              type='number'
              min="0"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}>
            </input>
            <div className='trns-form-input-sign'>
                <h4>$</h4>
                <input className='trns-form-asset-details-input-price' 
                  type='number'
                  min="0"
                  step="any"
                  value={pricePerCoin}
                  onChange={(event) => setPricePerCoin(event.target.value)}>
                </input>
            </div>
          </div>
          <button className='form-btn' type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
   </div>
  )
}

export default TransactionForm