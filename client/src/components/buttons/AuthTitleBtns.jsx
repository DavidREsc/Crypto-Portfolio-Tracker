import React, {useState} from 'react'

const AuthTitleBtns = (props) => {
    const {changeForm, state} = props
    const [login, setLogin] = useState(state)
    const styleActive = {borderBottom: "1px solid #00bcd4"}
    const styleInactive = {color: "hsl(187,100%,17%)"}

    const handleChangeForm = () => {
        setLogin(prevState => !prevState)
        changeForm()
    }

  return (
    <div className='authenticate-titles'>
		<button 
		    style={login ? styleActive : styleInactive}
			className='authenticate-login-title'
			type='button'
			onClick={handleChangeForm}
            disabled={login ? true : false}>
			Log In
		</button>
		<button 
			className='authenticate-signup-title'
			style={login ? styleInactive : styleActive}
			type='button'
            onClick={handleChangeForm}
            disabled={login ? false : true}>
			Sign Up
		</button>
	</div>
  )
}

export default AuthTitleBtns