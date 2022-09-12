import React from 'react'
import {MdClose} from 'react-icons/md';
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { createPortfolioSchema } from '../../utils/yupSchemas'
import { TextFieldTransaction } from '../../styles/MaterialUi.styled';
import CreatePortfolioBtn from '../buttons/CreatePortfolioBtn';

// Form for creating a new portfolio
const CreatePortfolioForm = (props) => {
    const {reference, createPortfolio, closeForm, loading} = props;

    const {handleSubmit, control} = useForm({
      resolver: yupResolver(createPortfolioSchema)
    })

  return (
   <div className='overlay'>
    <form className='create-portfolio-form-container' ref={reference} onSubmit={handleSubmit(createPortfolio)} >
        <div className='create-portfolio-form-title-container'>
          <h3 className='create-portfolio-form-title'>Create Portfolio</h3>
          <MdClose onClick={closeForm} style={{fontSize: '1.5rem', cursor: 'pointer'}}/>
        </div>
        <div className='create-portfolio-form'>
        <Controller 
            control={control}
            name='name'
            defaultValue=""
            render={({ field: {onChange, value}, fieldState: {error} }) => (
              <TextFieldTransaction
                inputRef={input => input && input.focus()}
                fullWidth
                error={!!error}
                label='Portfolio Name'
                variant='outlined'
                autoComplete='off'
                onChange={onChange}
                value={value}
                helperText={error ? error.message : null}
              />
            )}
          />
        <div className='create-portfolio-button'>
        <CreatePortfolioBtn text={'Create'} loading={loading}/>
        </div>
        </div>
    </form>
   </div>
  )
}
export default CreatePortfolioForm