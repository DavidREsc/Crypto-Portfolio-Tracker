import React, {useContext, useState, useEffect} from 'react';
import Auth from '../apis/Auth';

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
        isAuthenticated();
    },[])

    const login = async (data) => {
        const {email, password} = data;

        try {
            const response = await Auth.post('/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                email,
                password
            });
            if (!response.data.error) setUser(true);
            return response;
        } catch (error) {
            return error.response;          
        }
    }

    const signup = async (data) => {
        const {email, password, confirmPassword} = data;
        
        try {
            const response = await Auth.post('/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                email,
                password,
                confirmPassword
            });
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

    const isSignedIn = () => {
        if (user) return true;
        else return false;
    }

    const value = {
        login,
        signup,
        logout,
        isSignedIn,
        user
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
