import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './app/Pages/Home';
import Detail from './app/Pages/Detail';
import Login from './app/Pages/Login';
import Register from './app/Pages/Register';
import Profile from './app/Pages/Profile';
import QuatreCentQuatre from './app/Pages/NotFound';

import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router , Route , Switch } from 'react-router-dom/cjs/react-router-dom.min';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/detail/:idGame" component={Detail} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/profile" component={Profile} />
        <Route component={QuatreCentQuatre} />
      </Switch>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
