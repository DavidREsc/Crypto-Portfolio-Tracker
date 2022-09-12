import React from 'react'
import { ButtonSignIn } from '../../styles/MaterialUi.styled'
import LoadingState from './LoadingState'

const SignInButton = (props) => {
    const {text, loading} = props
  return (
    <ButtonSignIn variant='outlined' fullWidth type='submit'>
		{!loading && text} 
		{loading && 
			<LoadingState text='PLEASE WAIT'/>
		}
	</ButtonSignIn>
  )
}

export default SignInButton
