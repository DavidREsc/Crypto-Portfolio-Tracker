import React from 'react'

const DeleteTransactionForm = (props) => {
    const {reference, deleteTransaction, closeForm} = props;
  return (
    <div className='delete-asset-form' ref={reference}>
        <h4 className='delete-asset-form-title'>Delete Transaction?</h4>
        <div className='delete-asset-form-btns'>
            <button className='delete-asset-btn' onClick={deleteTransaction}>Yes</button>
            <button className='delete-asset-btn' onClick={closeForm}> No</button>
        </div>
    </div>
  )
}

export default DeleteTransactionForm