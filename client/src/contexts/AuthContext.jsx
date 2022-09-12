import React, {useContext, useState, useEffect} from 'react';
import Auth from '../apis/Auth';
import {ToastContainer} from 'react-toastify';
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

    const authenticated = () => setUser(true)

    const logout = async () => {
        try {
            await Auth.post('/logout', {
                credentials: 'include'
            });
            window.location.reload();
        } catch (error) {
            console.log(error.message);
        }
    }

    const value = {
        logout,
        isAuthenticated,
        authenticated,
        user,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
            <ToastContainer
              position="top-center"
              autoClose={1000}
              hideProgressBar={true}
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
