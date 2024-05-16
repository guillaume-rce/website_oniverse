import React, { useEffect, useState } from 'react';
import Game from '../../components/admin/Game';
import { CartProvider } from '../../CartContext';
import Header from '../../components/Header';

const AdminGames = () => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/games?sortOrder=asc')
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch games', error);
                    setError('Failed to fetch games');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No games found');
                    return;
                }

                setGames(data);
            });
    }, []);

    if (!games) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-games">
            <CartProvider>
                <Header hide={false} />
            </CartProvider>
            <label style={{ fontSize: '3em', color: '#fff', fontWeight: 'bold' }}
                className="title">Tous les jeux</label>
            <div className="games">
                {games.map((game) => (
                    <Game key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
}

export default AdminGames;