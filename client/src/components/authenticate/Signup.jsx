import React from 'react'

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
		  <div className='input-container'>
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
		  </div>
		  <div className='input-container'>
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
		  </div>
		  <div className='input-container'>
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
		  </div>
		  <input className='authenticate-btn' type='submit' value='Register'/>
		</form>
    )
}

export default Signup
