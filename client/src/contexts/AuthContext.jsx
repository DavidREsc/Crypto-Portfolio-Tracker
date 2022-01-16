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
            setUser(true);
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
            setUser(true);
            return response;
        } catch (error) {
            return error.response;
        }
    }

    const value = {
        login,
        signup,
        user
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
