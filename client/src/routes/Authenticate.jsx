import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Login from '../components/authenticate/Login';
import Signup from '../components/authenticate/Signup';
import Auth from '../apis/Auth'
import { useAuth } from '../contexts/AuthContext';
import '../styles/authenticate.css'

const Authenticate = () => {

  const [form, setForm] = useState(true);
	const [serverError, setServerError] = useState("")
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const [loading, setLoading] = useState(false)
	const [demoLoading, setDemoLoading] = useState(false)
	const history = useHistory();
	const {user, authenticated} = useAuth();

	// Redirect to portfolio page if user already logged in
	useEffect(() => {
		if (user) history.push('/portfolio');
		else setIsAuthenticated(false); // loads page only if user isn't authenticated
	}, [user, history]);

	// Flips state for switching between sign up and login form
	const handleChangeForm = () => {
		setForm(prevState => !prevState)
		setServerError("")
	}

	// Signs up user
	const handleSignUp = async (data) => {
		const {email, password, confirmPassword} = data
		setLoading(true) //for button loading state
		try {
			await Auth.post('/register', {
				method: 'POST',
				header: {'Content-Type': 'application/json'},
				email,
				password,
				confirmPassword
			})
			authenticated() // user is set to true in AuthContext which will cause a  
											// rerender and user will be redirected to portfolio route
		} catch (e) {
			setServerError(e.response.data.error)
			setLoading(false)
		}
	}

	// Logs in user
	const handleLogin = async (data) => {
		const {email, password} = data
		setLoading(true)
		try {
			await Auth.post('/login', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				email,
				password
			})
			authenticated()
		} catch (e) {
			setServerError(e.response.data.error)
			setLoading(false)
		}
	}

	// Log in for demo
	const demoLogin = async () => {
		setDemoLoading(true)
		const email = 'david.rapalae@gmail.com'
		const password = 'demo123$'
		try {
			await Auth.post('/login', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				email,
				password
			})
			authenticated()
		} catch (e) {
			setServerError(e.response.data.error)
			setDemoLoading(false)
		}
	}

	return (
		!isAuthenticated &&
      <div className='sign-in-page'>
				{!form ? 
					<Signup
						changeForm={handleChangeForm}
						onSubmit={handleSignUp}
						serverError={serverError}
						loading={loading}
					/>
				:
					<Login 
						changeForm={handleChangeForm}
						onSubmit={handleLogin}
						serverError={serverError}
						loading={loading}
						demoLogin={demoLogin}
						demoLoading={demoLoading}
					/>
				}
		</div>
	)
}

export default Authenticate
