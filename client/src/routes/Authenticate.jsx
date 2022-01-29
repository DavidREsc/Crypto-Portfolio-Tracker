import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import Login from '../components/authenticate/Login';
import Signup from '../components/authenticate/Signup';
import { useAuth } from '../contexts/AuthContext';
import '../styles/authenticate.css'

const Authenticate = () => {

	const {login, signup} = useAuth();
    const [form, setForm] = useState(0);
	const [loginError, setLoginError] = useState("");
    const [loginInfo, setLoginInfo] = useState({
    	email: "",
        password: "",
    });
	const [signupError, setSignupError] = useState("");
    const [signupInfo, setSignupInfo] = useState({
    	email: "",
    	password: "",
    	confirmPassword: ""
    })
	const history = useHistory();
	const {isSignedIn} = useAuth();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (isSignedIn()) history.push('/portfolio')
		setLoading(false);
	},[history, isSignedIn])

	const handleChangeForm = () => {
		if (!form) {
			setLoginInfo({
				email: "",
				password: ""
			});
			setLoginError("");
			setForm(1);
		} else {
			setSignupInfo({
				email: "",
				password: "",
				confirmPassword: ""
			});
			setSignupError("");
			setForm(0);
		}
	}

	const handleLoginInput = (e) => {
		const key = e.target.name;
		const value = e.target.value;
		setLoginInfo(prevInfo => ({
			...prevInfo,
			[key]: value
		}));
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
		const response = await login(loginInfo)
		handleLoginResponse(response);
	}

	const handleSignup = async (e) => {
		e.preventDefault();
		const response = await signup(signupInfo);
		handleSignupResponse(response);
	}

	const handleLoginResponse = (res) => {
		if (res.status === 422 || res.status === 500) {
			setLoginError(res.data.errors[0].msg);
		} else if (res.status === 200) {
			if (res.data.error) {
				setLoginError(res.data.error);
			}
			else history.push('/portfolio');
		}
	}

	const handleSignupResponse = (res) => {
		if (res.status === 422 || res.status === 500) {
			setSignupError(res.data.errors[0].msg);
		} else if (res.status === 200) {
			if (res.data.error) {
				setSignupError(res.data.error)
			}
			else history.push('./portfolio');
		}
	}

	return (
	  !loading &&
        <div className='sign-in-page'>
		  {form ?
		    <Signup
			  error={signupError}
		      changeForm={handleChangeForm}
		      onSubmit={handleSignup}
		      onChange={handleSignupInput}
		      inputs={signupInfo}
		    /> :
		    <Login 
			  error={loginError}
		      changeForm={handleChangeForm}
		      onSubmit={handleLogin}
		      onChange={handleLoginInput}
		      inputs={loginInfo}
		    />
	      }
		</div>
	)
}

export default Authenticate
