import React, {useContext, useState, useEffect, useCallback} from 'react';
import Auth from '../apis/Auth';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useHistory} from 'react-router-dom';

const AuthContext = React.createContext();


export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true)
    const history = useHistory();

    const isAuthenticated = useCallback(async () => {
        try {
            const response = await Auth.post('/verify');
            if (response.data.error) setUser(false);
            else setUser(true);
        } catch (error) {
            setUser(false);
            history.push("./sign-in");
        }
        setLoading(false);
    },[history])

    useEffect(() => {
        isAuthenticated();
    },[isAuthenticated])

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
