import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Login from '../components/authenticate/Login';
import Signup from '../components/authenticate/Signup';
import { useAuth } from '../contexts/AuthContext';
import PortfolioRoute from '../apis/PortfolioRoute';
import '../styles/authenticate.css'

const Authenticate = () => {

	const {login, signup} = useAuth();
    const [form, setForm] = useState(0);
	const [loginError, setLoginError] = useState("");
    const [loginInfo, setLoginInfo] = useState({email: "", password: ""});
	const [signupError, setSignupError] = useState("");
    const [signupInfo, setSignupInfo] = useState({email: "", password: "", confirmPassword: ""})
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const {user} = useAuth();

	useEffect(() => {
		if (user) history.push('/portfolio');
		setLoading(false);
	}, [user, history]);

	const handleChangeForm = () => {
		if (!form) {
			setLoginInfo({email: "", password: ""});
			setLoginError("");
			setForm(1);
		} else {
			setSignupInfo({email: "", password: "", confirmPassword: ""});
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

	const demoLogin = async () => {
		const demoInfo = {
			"email": "demo@gmail.com",
			"password": "demo1234"
		}
		const response = await login(demoInfo);
		handleLoginResponse(response);
	}

	const handleSignup = async (e) => {
		e.preventDefault();
		const response = await signup(signupInfo);
		handleSignupResponse(response);
	}

	const handleLoginResponse = (res) => {
		if (res.status === 422 || res.status === 500 || res.status === 400) {
			setLoginError(res.data.error[0]);
		} else if (res.status === 200) {
			if (res.data.error) {
				setLoginError(res.data.error);
			}
			else history.push('/portfolio');
		}
	}

	const handleSignupResponse = (res) => {
		if (res.status === 422 || res.status === 500 || res.status === 400) {
			console.log(res)
			setSignupError(res.data.error[0]);
		} else if (res.status === 200) {
			if (res.data.error) {
				setSignupError(res.data.error)
			}
			else { 		
				createDefaultPortfolio();
				history.push('./portfolio');
			}
		}
	}

	const createDefaultPortfolio = async () => {
		try {
			await PortfolioRoute.post('/create-portfolio', {
				method: 'POST',
                headers: {'Content-Type': 'application/json'},
				name: 'Main',
				main: 't'
			});
		} catch (error) {
			console.log(error);
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
			  demoLogin={demoLogin}
		    />
	      }
		</div>
	)
}

export default Authenticate
