import React from 'react'


// Form for deleting a portfolio
const DeletePortfolioForm = (props) => {
    const {reference, closeForm, deletePortfolio} = props;
  return (
   <div className='overlay'>
    <div className='delete-asset-form' ref={reference}>
        <h4 className='delete-asset-form-title'>Delete Portfolio?</h4>
        <p className='form-text'>Any transactions associated with this portfolio will be deleted.</p>
        <div className='delete-asset-form-btns'>
            <button className='delete-form-btn' onClick={deletePortfolio}>Delete</button>
            <button className='cancel-form-btn' onClick={closeForm}>Cancel</button>
        </div>
    </div>
   </div>
  )
}

export default DeletePortfolioForm