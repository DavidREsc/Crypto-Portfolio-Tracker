import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Portfolio from './routes/Portfolio';
import Browse from './routes/Browse';
import CoinDetails from './routes/CoinDetails';
import Header from './components/header/Header';
import Authenticate from "./routes/Authenticate";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { AssetsProvider } from "./contexts/AssetsContext";
import './styles/app.css';

const App = () => {
    return (
        <Router>
          <AuthProvider>
            <Header />
                <Switch>
                    <AssetsProvider>  
                      <Route exact path='/browse' component={Browse}/>
                      <Route exact path='/browse/:id' component={CoinDetails}/>
                      <Route exact path='/sign-in' component={Authenticate}/>             
                      <PrivateRoute path='/portfolio' component={Portfolio}/>
                    </AssetsProvider>
                </Switch>
          </AuthProvider>
        </Router>
    )
}

export default App;
