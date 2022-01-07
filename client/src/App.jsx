import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './routes/Home';
import Portfolio from './routes/Portfolio';
import Browse from './routes/Browse';
import CoinDetails from './routes/CoinDetails';
import Header from './components/header/Header';
import Authenticate from "./routes/Authenticate";
import './styles/app.css';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/sign-in' element={<Authenticate/>}/>
                <Route path='/Portfolio' element={<Portfolio/>}/>
                <Route path='/Browse' element={<Browse/>}/>
                <Route path='/Browse/:id' element={<CoinDetails/>}/>
            </Routes>
        </Router>
    )
}

export default App;
