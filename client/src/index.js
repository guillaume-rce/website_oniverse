import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './app/Pages/Home';
import Games from './app/Pages/Games';
import Detail from './app/Pages/Detail';
import Auth from './app/Pages/Auth';
import Profile from './app/Pages/Profile';
import ShoppingCart from './app/Pages/ShoppingCart';
import QuatreCentQuatre from './app/Pages/NotFound';
import OrderHistory from './app/Pages/OrderHistory';
import Admin from './app/Pages/Admin';
import AdminOrders from './app/Pages/admin/AdminOrders';
import AdminOrder from './app/Pages/admin/AdminOrder';
import AdminGames from './app/Pages/admin/AdminGames';
import AdminGame from './app/Pages/admin/AdminGame';
import User from './app/Pages/User';

import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { CartProvider } from './app/CartContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
    <React.StrictMode>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/games" component={Games} />
          <Route exact path="/detail/:idGame" component={Detail} />
          <Route exact path="/auth" component={Auth} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/shopping-cart" component={ShoppingCart} />
          <Route exact path="/orders" component={OrderHistory} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/admin/orders" component={AdminOrders} />
          <Route exact path="/admin/orders/:id" component={AdminOrder} />
          <Route exact path="/admin/games" component={AdminGames} />
          <Route exact path="/admin/games/:id" component={AdminGame} />
          <Route exact path="/user/:userId" component={User} />
          <Route component={QuatreCentQuatre} />
        </Switch>
      </Router>
    </React.StrictMode>
  </CartProvider>
);

reportWebVitals();
