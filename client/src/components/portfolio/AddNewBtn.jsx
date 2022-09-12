import React from 'react'
import { ButtonAddNew } from '../../styles/MaterialUi.styled'

const AddNewBtn = (props) => {
	const {showBrowseAssetForm} = props

  return (
		<div className='add-asset-container'>
    	<ButtonAddNew onClick={showBrowseAssetForm}>Add New</ButtonAddNew>
		</div>
  )
}

export default AddNewBtn