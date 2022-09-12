import React from 'react'
import {TextFieldSignIn} from '../../styles/MaterialUi.styled'
import DemoButton from '../buttons/DemoButton'
import AuthTitleBtns from '../buttons/AuthTitleBtns'
import SignInButton from '../buttons/SignInButton'
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { loginSchema } from '../../utils/yupSchemas'
import '../../styles/materialsuiGlobal.css'


// Login form
const Login = (props) => {

  const {changeForm, onSubmit, serverError, loading, demoLogin, demoLoading} = props;
	const {handleSubmit, control} = useForm({
		resolver: yupResolver(loginSchema)
	})

    return (
      <form className='authenticate-form' onSubmit={handleSubmit(onSubmit)}>
				<AuthTitleBtns changeForm={changeForm} state={true}/>
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
			<div style={{width: '85%'}}>
			<SignInButton text='Log In' loading={loading}/>
			<DemoButton text='Demo' demoLoading={demoLoading} demoLogin={demoLogin} />
			</div>
		</form>
    )
}

export default Login
