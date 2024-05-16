import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useEffect, useState } from 'react';

import Header from '../components/Header';
import GamePres from '../components/detail/GamePres';
import { CartProvider } from '../CartContext';

function Detail() {
    var { idGame } = useParams();
    const [c_game, setGame] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:3001/games/' + idGame)
        .then(response => response.json())
        .then(data => {
            setGame(data);
        })
        .catch(error => console.error('Erreur lors de la récupération des jeux :', error));
    }, []);

    if (c_game === undefined || c_game.length === 0) {
        return (<div>Chargement...</div>);
    }

    return (
        <CartProvider>
            <div className="Detail">
                <Header hide={false} />
                { c_game ? <GamePres game={c_game} /> : <p>Le jeu numéro {idGame} n'existe pas</p> }
            </div>
        </CartProvider>
    );
}

export default Detail;