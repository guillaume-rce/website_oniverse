import { useCart } from "../CartContext";
import Header from "../components/Header";
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";

import './Games.css';
import Game from "../components/games/Game";

const Games = () => {
    const { addToCart } = useCart();
    const [games, setGames] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/games')
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

        fetch('http://localhost:3001/tags')
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch tags', error);
                    setError('Failed to fetch tags');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No tags found');
                    return;
                }

                setTags(data);
            });
    }, []);

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Header hide={false} />
            <div className='games-page'>
                <label className='title'>Nos jeux</label>
                <div className='filter-container'>
                </div>
                <div className='games-container'>
                    {games.map((game) => (
                        <Game key={game.id} game={game} addToCart={addToCart} height={300} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Games;