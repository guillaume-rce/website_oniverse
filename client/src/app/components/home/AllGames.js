import GameCard from "./GameCard";

import React, { useEffect, useState } from 'react';
import './AllGames.css';

function AllGames() {
    const [games, setGames] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:3001/games')
        .then(response => response.json())
        .then(data => {
            setGames(data);
        })
        .catch(error => console.error('Erreur lors de la récupération des jeux :', error));
    }, []);


    if (games === undefined || games.length === 0) {
        return (<div>Chargement...</div>);
    }

    return (
        <div className="AllGames">
            <label className="AllGames_title">Nous jeux</label>
            <div className="AllGames_container">
                {games.map((game, index) => (
                    <GameCard c_game={game} key={index} />
                ))}
            </div>
        </div>
    );
}

export default AllGames;