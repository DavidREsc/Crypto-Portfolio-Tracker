import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Portfolio from './routes/Portfolio';
import Browse from './routes/Browse';
import Home from './routes/Home';
import CoinDetails from './routes/CoinDetails';
import Header from './components/header/Header';
import PageNotFound from "./routes/PageNotFound";
import Authenticate from "./routes/Authenticate";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { AssetsProvider } from "./contexts/AssetsContext";
import './styles/app.css';

const App = () => {
    return (
        <Router>
          <AuthProvider>
          <AssetsProvider> 
            <Header />
                <Switch>
                    <Route exact path='/' component={Home}/>         
                      <Route exact path='/sign-in' component={Authenticate}/>
                      <Route exact path='/browse/:id' component={CoinDetails}/>            
                      <PrivateRoute exact path='/portfolio' component={Portfolio}/>
                      <Route exact path='/browse' component={Browse}/>
                      <Route path='*' component={PageNotFound}/>
                </Switch>
                </AssetsProvider>
          </AuthProvider>
        </Router>
    )
}

export default App;
