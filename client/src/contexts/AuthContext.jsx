import React, {useContext, useState, useEffect} from 'react';
import Auth from '../apis/Auth';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        isAuthenticated();
    },[])

    const isAuthenticated = async () => {
        try {
            const response = await Auth.post('/verify');
            if (response.data.error) setUser(false);
            else setUser(true);
        } catch (error) {
            setUser(false);
        }
        setLoading(false);
    }

    const login = async (data) => {
        const {email, password} = data;

        try {
            const response = await toast.promise(
                Auth.post('/login', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  email,
                  password
                }),
                {
                    pending: 'Logging in...',
                    error: 'Login Failed'
                }
            );
            if (!response.data.error) setUser(true);
            return response;
        } catch (error) {
            return error.response;          
        }
    }

    const signup = async (data) => {
        const {email, password, confirmPassword} = data;
        
        try {
            const response = await toast.promise(
                Auth.post('/register', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  email,
                  password,
                  confirmPassword
                }),
                {
                    pending: "Signing in...",
                    error: "Registration failed"
                }
            );
            if (!response.data.error) setUser(true);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    const logout = async () => {
        try {
            await Auth.get('/logout', {
                credentials: 'include'
            });
            window.location.reload();
        } catch (error) {
            console.log(error.message);
        }
    }

 

    const value = {
        login,
        signup,
        logout,
        isAuthenticated,
        user
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
            <ToastContainer
              position="top-center"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
        </AuthContext.Provider>
    )
}
