import React, { useState } from 'react';
import Login from '../components/authenticate/Login';
import Signup from '../components/authenticate/Signup';
import { useAuth } from '../contexts/AuthContext';
import '../styles/authenticate.css'

const Authenticate = () => {

	const {login, signup} = useAuth();
    const [form, setForm] = useState(0);
    const [remember, setRemember] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
    	email: "",
        password: "",
    });
    const [signupInfo, setSignupInfo] = useState({
    	email: "",
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
			    ...prevInfo,
			    [key]: value
		    }));
		}
	}

	const handleSignupInput = (e) => {
		const key = e.target.name;
		const value = e.target.value;

		setSignupInfo(prevInfo => ({
			...prevInfo,
			[key]: value
		}));
	}

	const handleLogin = async (e) => {
		e.preventDefault();
		login();
	}

	const handleSignup = async (e) => {
		e.preventDefault();
		signup(signupInfo);
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
