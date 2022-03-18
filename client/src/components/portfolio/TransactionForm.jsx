import React, {useState, useEffect} from 'react'
import { useAssets } from '../../contexts/AssetsContext';

const TransactionForm = (props) => {
    const {reference, selectedAsset, addTransaction} = props;
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
      addTransaction(quantity, pricePerCoin);
    }

  return (
    <div ref={reference} className='transaction-form-container-parent'>
      <div className='transaction-form-container'>
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
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}>
            </input>
            <input className='trns-form-asset-details-input' 
              type='number'
              value={pricePerCoin}
              onChange={(event) => setPricePerCoin(event.target.value)}>
            </input>
          </div>
          <button type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default TransactionForm