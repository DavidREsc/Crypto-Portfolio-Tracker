import React, {useState} from 'react'
import {MdClose} from 'react-icons/md';

// Form for editing a transaction
const EditTransactionForm = (props) => {
    const {handleSubmit, reference, transaction, closeForm} = props;
    const [quantity, setQuantity] = useState(transaction.asset_amount);
    const [pricePerCoin, setPricePerCoin] = useState(transaction.initial_price);

  return (
   <div className='overlay'>
    <div ref={reference} className='edit-transaction-form-container'>
         <button className='browse-form-icon' onClick={closeForm}><MdClose /></button>
         <form className='edit-transaction-form' onSubmit={(e) => handleSubmit(e, parseFloat(quantity), parseFloat(pricePerCoin))}>
          <h3>Edit Transaction</h3>
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
  )
}

export default EditTransactionForm