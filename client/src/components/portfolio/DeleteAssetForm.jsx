import React from 'react'

const deleteAssetForm = (props) => {
    const {reference, deleteAsset, closeForm} = props;
  return (
    <div className='delete-asset-form' ref={reference}>
        <h4 className='delete-asset-form-title'>Delete Asset?</h4>
        <div className='delete-asset-form-btns'>
            <button className='delete-asset-btn' onClick={deleteAsset}>Yes</button>
            <button className='delete-asset-btn' onClick={closeForm}> No</button>
        </div>
    </div>
  )
}

export default deleteAssetForm