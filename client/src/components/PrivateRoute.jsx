import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Used to secure portfolio page. Redirects to sign in page if unauthenticated
const PrivateRoute = ({component: Component, ...rest}) => {
    const {user} = useAuth();
    return (
        <Route
            {...rest}
            render={props => {
                return user ? <Component {...props} /> : <Redirect to='/sign-in'/>
            }}>
        </Route>
    )
}

export default PrivateRoute
