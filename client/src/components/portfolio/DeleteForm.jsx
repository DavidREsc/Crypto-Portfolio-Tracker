import React from 'react'
import DeleteButton from '../buttons/DeleteButton';
import { ButtonCancel } from '../../styles/MaterialUi.styled';

const DeleteForm = (props) => {
	const {reference, deleteFunc, closeForm, title, text, loading} = props;
  return (
		<div className='overlay'>
			<div className='delete-asset-form' ref={reference}>
				<h4 className='delete-asset-form-title'>{title}</h4>
				<p className='form-text'>{text}</p>
				<div className='delete-asset-form-btns'>
					<DeleteButton text='Delete' deleteFunc={deleteFunc} loading={loading}/>
					<ButtonCancel onClick={closeForm}>Cancel</ButtonCancel>
				</div>
			</div>
  	</div>
  )
}

export default DeleteForm