import React from 'react'
import { useAssets } from '../../contexts/AssetsContext';

const TransactionForm = (props) => {
    const {reference, selectedAsset} = props;
    const {assets} = useAssets();
    console.log(selectedAsset)
    //console.log(assets.filter(asset => asset.name === selectedAsset)[0].image)
  return (
    <div ref={reference} className='transaction-form-container-parent'>
      <div className='transaction-form-container'>
        <div className='trns-form-asset-name-input'>
          <img 
            className='coin-img'
            src={assets.filter(asset => asset.name === selectedAsset)[0].image}
            alt={selectedAsset}>
          </img>
          <p>{selectedAsset}</p>
        </div>
        <form className='transaction-form'>
          <div className='trns-form-details-label-container'>
            <label className="trns-form-asset-details-label"> Quantity</label>
            <label className="trns-form-asset-details-label"> Price Per Coin</label>
          </div>
          <div className="trns-form-details-input-container">
            <input className='trns-form-asset-details-input' autoFocus placeholder='0.00' type='number'></input>
            <input className='trns-form-asset-details-input' type='text' value={assets.filter(asset => asset.name === selectedAsset)[0].current_price}></input>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionForm