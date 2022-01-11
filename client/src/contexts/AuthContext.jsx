import React, {useContext, useState} from 'react';
import Auth from '../apis/Auth';
import { useHistory } from 'react-router-dom';

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState();
    const history = useHistory();

    const login = () => {
        console.log("Login")
    }

    const signup = async (data) => {
        const {email, password} = data;
        
        try {
            const response = await Auth.post('/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                email,
                password
            })
            setUser(true);
            history.push('/portfolio');
            console.log(response)
        } catch (error) {
            console.error(error.response.data.errors[0].msg);
        }
    }

    const validateJWT = () => {
        console.log("Validating JWT")
    }

    const value = {
        login,
        signup,
        validateJWT,
        user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
