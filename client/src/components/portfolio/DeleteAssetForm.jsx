import React from 'react'

const deleteAssetForm = (props) => {
    const {reference, deleteAsset, closeForm} = props;
  return (
   <div className='overlay'>
    <div className='delete-asset-form' ref={reference}>
        <h4 className='delete-asset-form-title'>Delete Asset?</h4>
        <p className='form-text'>Any transactions associated with this asset will also be removed.</p>
        <div className='delete-asset-form-btns'>
            <button className='delete-form-btn' onClick={deleteAsset}>Delete</button>
            <button className='cancel-form-btn' onClick={closeForm}>Cancel</button>
        </div>
    </div>
   </div>
  )
}

export default deleteAssetForm