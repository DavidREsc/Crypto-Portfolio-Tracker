import React, {useState, useEffect} from 'react'
import { useAssets } from '../../contexts/AssetsContext';
import {BiArrowBack} from 'react-icons/bi';
import {MdClose} from 'react-icons/md';

// Form for adding a new transaction
const TransactionForm = (props) => {
    const {reference, selectedAsset, addTransaction, handleTrnsBackBtn, closeForm} = props;
    const [quantity, setQuantity] = useState("");
    const [pricePerCoin, setPricePerCoin] = useState("");
    const [priceModifed, setPriceModified] = useState(false)
    const {assets} = useAssets();

    // Gets and sets the current price of selected coin
    useEffect(() => {
      if (!priceModifed) {
        setPricePerCoin(() => {
          return (assets.filter(asset => asset.name === selectedAsset)[0].price)
        });
      }
    },[assets, selectedAsset, priceModifed]);

    // Function handler for submit
    const handleSubmit = (e) => {
      e.preventDefault();
      addTransaction(parseFloat(quantity), parseFloat(pricePerCoin));
    }

    const handlePriceChange = (e) => {
      const price = e.target.value
      setPriceModified(true)
      setPricePerCoin(price)
    }

  return (
   <div className='overlay'>
    <div ref={reference} className='transaction-form-container-parent'>
      <div className='transaction-form-container'>
        <div className='trns-form-icons-container'>
          {/* Back button to select a different asset */}
          <button className='trns-form-icons' onClick={handleTrnsBackBtn}><BiArrowBack/></button>
          {/* Close button for closing form */}
          <button className='trns-form-icons' onClick={closeForm}><MdClose className='trns-form-icons'/></button>
        </div>

        {/* Title */}
        <h3 className='trns-form-title'>Add Transaction</h3>

        {/* Asset image and name */}
        <div className='trns-form-asset-name-input'>
          <img 
            className='coin-img'
            src={assets.filter(asset => asset.name === selectedAsset)[0].iconUrl}
            alt={selectedAsset}>
          </img>
          <p>{selectedAsset}</p>
        </div>

        {/* Quantity and price per coin */}
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
                  onChange={(e) => handlePriceChange(e)}>
                </input>
            </div>
          </div>

          {/* Submit button*/}
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