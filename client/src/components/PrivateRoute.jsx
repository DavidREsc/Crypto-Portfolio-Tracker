import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PortfolioProvider } from '../contexts/PortfolioContext'

// Used to secure portfolio page. Redirects to sign in page if not authenticated
const PrivateRoute = ({component: Component, ...rest}) => {
    const {user} = useAuth();
    return (
        <Route
            {...rest}
            render={props => {
                return user ? <PortfolioProvider><Component {...props} /></PortfolioProvider> : <Redirect to='/sign-in'/>
            }}>
        </Route>
    )
}

export default PrivateRoute
