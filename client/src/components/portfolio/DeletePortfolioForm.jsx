import React from 'react'

const DeletePortfolioForm = (props) => {
    const {reference, closeForm, deletePortfolio} = props;
  return (
    <div className='delete-asset-form' ref={reference}>
        <h4 className='delete-asset-form-title'>Delete Portfolio?</h4>
        <div className='delete-asset-form-btns'>
            <button className='delete-asset-btn' onClick={deletePortfolio}>Yes</button>
            <button className='delete-asset-btn' onClick={closeForm}>No</button>
        </div>
    </div>
  )
}

export default DeletePortfolioForm