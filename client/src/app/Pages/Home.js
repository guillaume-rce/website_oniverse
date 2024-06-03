import React from 'react';
import './Home.css';

import Header from '../components/Header';
import GamePres from '../components/home/GamePres';
import AllGames from '../components/home/AllGames';

import LastDiscounts from '../components/home/LastDiscounts';


function Home() {
  return (
    <div className="App">
      <Header hide={true} />
      <GamePres />
      <LastDiscounts />
      <div className="home-separator"></div>
      <AllGames />
    </div>
  );
}

export default Home;
