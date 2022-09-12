import React from 'react'
import { ButtonDelete} from '../../styles/MaterialUi.styled'
import LoadingState from './LoadingState'

const DeleteButton = (props) => {
    const {text, loading, deleteFunc} = props
  return (
    <ButtonDelete variant='outlined' fullWidth type='button' onClick={deleteFunc}>
        {!loading && text}
        {loading && 
        <LoadingState text='PLEASE WAIT'/>
        }
    </ButtonDelete>
  )
}

export default DeleteButton