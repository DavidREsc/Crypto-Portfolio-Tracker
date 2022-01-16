import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './routes/Home';
import Portfolio from './routes/Portfolio';
import Browse from './routes/Browse';
import CoinDetails from './routes/CoinDetails';
import Header from './components/header/Header';
import Authenticate from "./routes/Authenticate";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import './styles/app.css';

const App = () => {
    return (
        <Router>
            <Header />
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/browse' component={Browse}/>
                    <Route exact path='/browse/:id' component={CoinDetails}/>
                    <AuthProvider>
                        <Route path='/sign-in' component={Authenticate}/>
                        <PrivateRoute path='/portfolio' component={Portfolio}/>
                    </AuthProvider>
                </Switch>
        </Router>
    )
}

export default App;