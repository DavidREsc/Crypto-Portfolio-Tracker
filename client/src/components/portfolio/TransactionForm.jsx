import React from 'react'
import {BiArrowBack} from 'react-icons/bi';
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { transactionSchema } from '../../utils/yupSchemas'
import { TextFieldTransaction } from '../../styles/MaterialUi.styled';
import AddTransactionBtn from '../buttons/AddTransactionBtn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InputAdornment from '@mui/material/InputAdornment';
import CloseFormBtn from '../buttons/CloseFormBtn';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { withStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BlueRadio = withStyles({
  root: {
    color: blue[400],
    "&$checked": {
      color: blue[600]
    }
  },
  checked: {}
})((props) => <Radio color="default" {...props} />);

const curDate = new Date()

// Form for adding a new transaction
const TransactionForm = (props) => {
    const {reference, addTransaction, handleTrnsBackBtn, closeForm, name, icon, defaultPrice, loading} = props;
    const {handleSubmit, control} = useForm({
      resolver: yupResolver(transactionSchema)
    })

  return (
    <div className='overlay'>
      {/* Quantity and price per coin */}
      <form ref={reference} className='transaction-form' onSubmit={handleSubmit(addTransaction)}>
        <div className='trns-form-icons-container'>
          {/* Back button to select a different asset */}
          <button type='button' className='trns-form-icons' onClick={handleTrnsBackBtn}><BiArrowBack/></button>
          {/* Close button for closing form */}
          <CloseFormBtn closeForm={closeForm}/>
        </div>

        {/* Title */}
        <h3 className='trns-form-title'>Add Transaction</h3>

        {/* Asset image and name */}
        <div className='trns-form-asset-name-input'>
          <img className='coin-img' src={icon} alt={name}></img>
          <p>{name}</p>
        </div>
        <div className='trns-radio'>
          <Controller
            name={'type'}
            control={control}
            defaultValue="buy"
            render={({field: {onChange, value}}) => (
              <RadioGroup value={value} onChange={onChange} style={{display: 'flex', flexDirection: 'row', margin: 'auto'}}>
                <FormControlLabel
                  value={'buy'}
                  label={'Buy'}
                  control={<BlueRadio />}
                />
                <FormControlLabel
                  value={'sell'}
                  label={'Sell'}
                  control={<BlueRadio />}
                />
              </RadioGroup>
            )}
            />
        </div>
        <div className='date-picker'>
          <label>Date</label>
          <Controller
            control={control}
            name="reactDatepicker"
            defaultValue={curDate}
            render={({ field: { onChange, value, ref } }) => (
              <ReactDatePicker
                onChange={onChange}
                selected={value}
              />
            )}
          />
        </div>

        <div className="trns-form-details-input-container">
          <Controller 
            control={control}
            name='quantity'
            defaultValue=""
            render={({ field: {onChange, value}, fieldState: {error} }) => (
              <TextFieldTransaction
                inputRef={input => input && input.focus()}
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
            <AddTransactionBtn text='Add Transaction' loading={loading}/>
          </div>
          
      </form>
    </div>
  )
}

export default TransactionForm