import React from 'react';
import './Home.css';
import { CartProvider } from '../CartContext'; // Vérifiez que le chemin d'importation est correct

import Header from '../components/Header';
import GamePres from '../components/home/GamePres';
import AllGames from '../components/home/AllGames';


function Home() {
  return (
    <CartProvider>
      <div className="App">
        <Header hide={true} />
        <GamePres />
        <AllGames />
      </div>
    </CartProvider>  
  );
}

export default Home;
