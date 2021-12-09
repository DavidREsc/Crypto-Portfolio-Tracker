import React from 'react'
import '../../styles/authenticate.css'

const Signup = (props) => {

    const {changeForm, onSubmit, onChange, inputs} = props;

    return (
        <form className='authenticate-form' onSubmit={onSubmit}>
		  <div className='authenticate-titles'>
		    <button 
		      style={{color: "rgba(255,255,255,0.3)"}}
		      className='authenticate-login-title'
		      type='button'
		      onClick={changeForm}>
		      Login
		    </button>
		    <button 
		      className='authenticate-signup-title'
		      style={{borderBottom: "2px solid white"}}
		      type='button'>
		      Sign Up
		    </button>
		  </div>
		  <label className='authenticate-label'>
		    Email
		    <input
		      className='authenticate-input'
		      autoComplete='off'
		      type='text'
		      name='email'
		      onChange={onChange}
		      value={inputs.email}
		    />
		  </label>
		  <label className='authenticate-label'>
		    Username
		    <input
		      className='authenticate-input'
		      autoComplete='off'
		      type='text'
		      name='username'
		      onChange={onChange}
		      value={inputs.username}
		    />
		  </label>
		  <label className='authenticate-label'>
		    Password
		    <input
		      className='authenticate-input'
		      type='password'
		      minLength='8'
		      name='password'
		      onChange={onChange}
		      value={inputs.password}
		    />
		  </label>
		  <label className='authenticate-label'>
		    Confirm Password
		    <input
		      className='authenticate-input'
		      type='password'
		      minLength='8'
		      name='confirmPassword'
		      onChange={onChange}
		      value={inputs.confirmPassword}
		    />
		  </label>
		  <input className='authenticate-btn' type='submit' value='Register'/>
		</form>
    )
}

export default Signup
