import React, { useState } from 'react';
import Login from '../components/authenticate/Login';
import Signup from '../components/authenticate/Signup';
import '../styles/authenticate.css'

const Authenticate = () => {
    const [form, setForm] = useState(0);
    const [remember, setRemember] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
    	username: "",
        password: "",
    });
    const [signupInfo, setSignupInfo] = useState({
    	email: "",
    	username: "",
    	password: "",
    	confirmPassword: ""
    })

	const handleChangeForm = () => {
		if (!form) {
			setForm(1);
		} else setForm(0);
	}

	const handleLoginInput = (e) => {
		const key = e.target.name;

		if (key === "remember") {
			const value = e.target.checked;
			setRemember(value);
		} else {
			const value = e.target.value;
			setLoginInfo(prevInfo => ({
			    ...loginInfo,
			    [key]: value
		    }));
		}
	}

	const handleSignupInput = (e) => {
		const key = e.target.name;
		const value = e.target.value;

		setSignupInfo(prevInfo => ({
			...signupInfo,
			[key]: value
		}));
	}

	const handleLogin = async (e) => {
		e.preventDefault();
		console.log("Login submitted");
	}

	const handleSignup = async (e) => {
		e.preventDefault();
		console.log("Signup submitted");
	}

	return (

        <div className='sign-in-page'>
		  {form ?
		    <Signup
		      changeForm={handleChangeForm}
		      onSubmit={handleSignup}
		      onChange={handleSignupInput}
		      inputs={signupInfo}
		    /> :
		    <Login 
		      changeForm={handleChangeForm}
		      onSubmit={handleLogin}
		      onChange={handleLoginInput}
		      inputs={loginInfo}
		      remember={remember}
		    />
	      }
		</div>
	)
}

export default Authenticate
