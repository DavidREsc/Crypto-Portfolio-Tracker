import React from 'react'
import {TextFieldSignIn} from '../../styles/MaterialUi.styled'
import AuthTitleBtns from '../buttons/AuthTitleBtns'
import SignInButton from '../buttons/SignInButton'
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { signUpSchema } from '../../utils/yupSchemas'

// Signup form
const Signup = (props) => {

  const {changeForm, onSubmit, serverError, loading} = props;
	const {handleSubmit, control} = useForm({
		resolver: yupResolver(signUpSchema)
	})

    return (
      <form className='authenticate-form' onSubmit={handleSubmit(onSubmit)}>
				<AuthTitleBtns changeForm={changeForm} state={false}/>
				<div className='error-div'>
					{serverError}
				</div>

		  	<div className='input-container'>
					<Controller 
						control={control}
						name='email'
						defaultValue=""
						render={({ field: {onChange, value}, fieldState: {error} }) => (
							<TextFieldSignIn
								fullWidth
								error={!!error}
								label='Email'
								variant='outlined'
								autoComplete='off'
								onChange={onChange}
								value={value}
								helperText={error ? error.message : null}
							/>
						)}
					/>
				</div>

				<div className='input-container'>
					<Controller 
							control={control}
							name='password'
							defaultValue=""
							render={({ field: {onChange, value}, fieldState: {error} }) => (
								<TextFieldSignIn
									label='Password'
									variant='outlined'
									error={!!error}
									fullWidth
									type='password'
									onChange={onChange}
									value={value}
									helperText={error ? error.message : null}
								/>
							)}
					/>			
				</div>

				<div className='input-container'>
					<Controller 
						control={control}
						name='confirmPassword'
						defaultValue=""
						render={({ field: {onChange, value}, fieldState: {error} }) => (
							<TextFieldSignIn
								label='Confirm Password'
								fullWidth
								error={!!error}
								variant='outlined'
								type='password'
								onChange={onChange}
								value={value}
								helperText={error ? error.message : null}
							/>
						)}
					/>	
				</div>
				<div style={{width: '85%'}}>
				<SignInButton loading={loading} text='Sign Up'/>
				</div>
			</form>
    )
}

export default Signup
