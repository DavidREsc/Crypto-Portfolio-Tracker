import React from 'react'
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { transactionSchema } from '../../utils/yupSchemas'
import { TextFieldTransaction } from '../../styles/MaterialUi.styled';
import AddTransactionBtn from '../buttons/AddTransactionBtn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InputAdornment from '@mui/material/InputAdornment';
import CloseFormBtn from '../buttons/CloseFormBtn';

// Form for adding a new transaction
const EditTransactionForm = (props) => {
    const {reference, editTransaction, closeForm, name, icon, defaultPrice, defaultQuantity, loading} = props;
    const {handleSubmit, control} = useForm({
      resolver: yupResolver(transactionSchema)
    })

  return (
    <div className='overlay'>
      {/* Quantity and price per coin */}
      <form ref={reference} className='transaction-form' onSubmit={handleSubmit(editTransaction)}>
        <div className='trns-form-icons-container'>
          {/* Close button for closing form */}
          <CloseFormBtn closeForm={closeForm}/>
        </div>

        {/* Title */}
        <h3 className='trns-form-title'>Edit Transaction</h3>

        {/* Asset image and name */}
        <div className='trns-form-asset-name-input'>
          <img className='coin-img' src={icon} alt={name}></img>
          <p>{name}</p>
        </div>

        <div className="trns-form-details-input-container">
          <Controller 
            control={control}
            name='quantity'
            defaultValue={defaultQuantity}
            render={({ field: {onChange, value}, fieldState: {error} }) => (
              <TextFieldTransaction
                type='number'
                placeholder='0.00'
                fullWidth
                error={!!error}
                label='Quantity'
                variant='outlined'
                autoComplete='off'
                onChange={onChange}
                value={value}
                helperText={error ? error.message : null}
              />
            )}
          />
          <Controller 
            control={control}
            name='pricePerCoin'
            defaultValue={defaultPrice}
            render={({ field: {onChange, value}, fieldState: {error} }) => (
              <TextFieldTransaction
                type='number'
                placeholder='0.00'
                fullWidth
                error={!!error}
                label='Price per coin'
                variant='outlined'
                autoComplete='off'
                onChange={onChange}
                value={value}
                helperText={error ? error.message : null}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color='primary' />
                      </InputAdornment>
                  ),
                }}
              />
            )}
          />

          </div>
          {/* Submit button*/}
          <div style={{marginTop: '2rem', width: '100%'}}>
            <AddTransactionBtn text='Edit Transaction' loading={loading}/>
          </div>
          
      </form>
    </div>
  )
}

export default EditTransactionForm