import { useEffect, useState } from 'react';
import Game from './Game';
import './Games.css';

const Games = ( { games } ) => {
    const [adding, setAdding] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [error, setError] = useState('');

    const handleClick = (event) => {
        setAdding(!adding);
        if (!adding) {
            setPosition({
                x: event.clientX,
                y: 680
            });
            setShowModal(true);
        }
    };

    useEffect(() => {
        if (!adding) {
            setTimeout(() => setShowModal(false), 300);
        }
    }, [adding]);

    const handleSubmit = (event) => {
        // Route: POST /games
        /*
        Request body:
        Multi-part form data
        Request body
            -name string
            -description string
            -price float
            -image binary
            -imageIsLight boolean
            -logo binary
            -logoIsLight boolean
        */
        event.preventDefault();

        const formData = new FormData(event.target);
        fetch('http://localhost:3001/games', {
            method: 'POST',
            body: formData,
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to create game', error);
                    setError('Failed to create game: ' + error);
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('Failed to create game');
                    setError('Failed to create game');
                    return;
                }

                games.push(data.game);
                setAdding(false);
            });
    };

    return (
        <div className="report-games">
            <label className="title">Jeux</label>
            <div className="report-games-container">
                {games.map((game) => (
                    <Game key={game.id} game={game} />
                ))}
            </div>
            <div className="report-games-actions">
                <button className="games-action"
                    onClick={() => window.location.href = '/admin/games'}
                >Voir tous les jeux</button>
                <button className="games-action" onClick={handleClick}>Ajouter un jeu</button>
            </div>
            {showModal && (
                <div className={`modal ${adding ? 'fade-in' : 'fade-out'}`} style={{ top: position.y, left: position.x }}>
                    <form onSubmit={handleSubmit} className="modal-content">
                        <input type="text" name="name" placeholder="Nom" />
                        <input type="number" name="price" placeholder="Prix" step="0.1" min={0} />
                        <input type="text" name="description" placeholder="Description" />

                        <input type="file" name="image" placeholder="Image" />
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '10px' }}>
                            <input type="checkbox" name="imageIsLight" />
                            <label htmlFor="imageIsLight">L'image est claire</label>
                        </div>

                        <input type="file" name="logo" placeholder="Logo" />
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '10px' }}>
                            <input type="checkbox" name="logoIsLight" />
                            <label htmlFor="logoIsLight">Le logo est clair</label>
                        </div>
                        <button type="submit">Ajouter</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Games;
