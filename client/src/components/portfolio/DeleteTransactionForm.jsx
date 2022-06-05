import React from 'react'

const DeleteTransactionForm = (props) => {
    const {reference, deleteTransaction, closeForm} = props;
  return (
   <div className='overlay'>
    <div className='delete-asset-form' ref={reference}>
        <h4 className='delete-asset-form-title'>Delete Transaction</h4>
        <p className='form-text'>Are you sure you want to delete this transaction?</p>
        <div className='delete-asset-form-btns'>
            <button className='delete-form-btn' onClick={deleteTransaction}>Yes</button>
            <button className='cancel-form-btn' onClick={closeForm}>Cancel</button>
        </div>
    </div>
   </div>
  )
}

export default DeleteTransactionForm