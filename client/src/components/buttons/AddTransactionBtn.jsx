import React from 'react'
import { ButtonTransaction } from '../../styles/MaterialUi.styled'
import LoadingState from './LoadingState'
const AddTransactionBtn = (props) => {
    const {text, loading} = props

    return (
      <ButtonTransaction variant='outlined' fullWidth type='submit'>
          {!loading && text} 
          {loading && 
              <LoadingState text='PLEASE WAIT'/>
          }
      </ButtonTransaction>
    )
}

export default AddTransactionBtn