import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './app/Pages/Home';
import Detail from './app/Pages/Detail';
import Auth from './app/Pages/Auth';
import Profile from './app/Pages/Profile';
import ShoppingCart from './app/Pages/ShoppingCart';
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
        <Route exact path="/auth" component={Auth} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/shopping-cart" component={ShoppingCart} />
        <Route component={QuatreCentQuatre} />
      </Switch>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
