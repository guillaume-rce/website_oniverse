import React from 'react';
import './Home.css';

import Header from '../components/Header';
import GamePres from '../components/home/GamePres';
import AllGames from '../components/home/AllGames';


function Home() {
  return (
    <div className="App">
      <Header hide={true} />
      <GamePres />
      <AllGames />
    </div>
  );
}

export default Home;
