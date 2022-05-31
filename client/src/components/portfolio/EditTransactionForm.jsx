import React, {useState} from 'react'

const EditTransactionForm = (props) => {
    const {handleSubmit, reference, transaction} = props;
    const [quantity, setQuantity] = useState(transaction.asset_amount);
    const [pricePerCoin, setPricePerCoin] = useState(transaction.initial_price);

  return (
    <div ref={reference} className='delete-asset-form'>
         <form className='transaction-form' onSubmit={(e) => handleSubmit(e, parseFloat(quantity), parseFloat(pricePerCoin))}>
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
          <button className='form-btn' type='submit'>
            Submit
          </button>
        </form>
    </div>
  )
}

export default EditTransactionForm