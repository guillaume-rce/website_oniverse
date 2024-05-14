import { useEffect, useState } from 'react';
import Game from './Game';
import './Games.css';

const Games = ( { games } ) => {
    return (
        <div className="report-games">
            <label className="title">Jeux</label>
            <div className="report-games-container">
                {games.map((game) => (
                    <Game key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
}

export default Games;
