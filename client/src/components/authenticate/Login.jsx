import React from 'react'

const Login = (props) => {

    const {changeForm, onSubmit, onChange, inputs, error} = props;

    return (
        <form className='authenticate-form' onSubmit={onSubmit}>
		  <div className='authenticate-titles'>
		    <button 
		      className='authenticate-login-title'
		      style={{borderBottom: "2px solid white"}}
		      type='button'>
		      Login
		    </button>
		    <button
		      style={{color: "rgba(255,255,255,0.3)"}}
		      className='authenticate-signup-title'
		      type='button'
		      onClick={changeForm}>
		      Sign Up
		    </button>
		  </div>
		  <div className='error-div'>
			{error}
		  </div>
		  <div className='input-container'>
		  <label className='authenticate-label'>
		    Email
		    <input 
		      className='authenticate-input'
		      autoComplete='off'
		      type='text'
		      name='email'
		      value={inputs.email}
		      onChange={onChange}
		    />
		  </label>
		  </div>
		  <div className='input-container'>
		  <label className='authenticate-label'>
		    Password
		    <input 
		      className='authenticate-input'
		      type='password'
		      name='password'
		      value={inputs.password}
		      onChange={onChange}
		    />
		  </label>
		  </div>
		  <input className='authenticate-btn' type='submit' value='Continue'/>
		</form>
    )
}

export default Login
