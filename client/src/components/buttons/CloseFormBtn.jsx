import React from 'react'
import {MdClose} from 'react-icons/md';

const CloseFormBtn = (props) => {
    const {closeForm} = props
  return (
    <button type='button' className='close-form-icon' onClick={closeForm}><MdClose /></button>
  )
}

export default CloseFormBtn