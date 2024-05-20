import { useState } from "react";

const Game = ({ game }) => {
    const [stock, setStock] = useState(game.stock);
    const [price, setPrice] = useState(game.price);

    const handleStock = (id, stock) => {
        stock = parseInt(stock);
        setStock(stock);

        fetch(`http://localhost:3001/games/${id}/stock`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stock })
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to update stock', error);
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('Failed to update stock');
                }
            });
    }

    const handlePrice = (id, price) => {
        price = parseFloat(price);
        setPrice(price);

        fetch(`http://localhost:3001/games/${id}/price`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ price })
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to update price', error);
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('Failed to update price');
                }
            });
    }

    return (
        <div key={game.id} className="report-game">
            <img src={game.image.path} alt={game.name} className="game-image" />
            <label className="game-name">{game.name}</label>
            <div>
                <label className="game-stock-label" style={{ marginRight: '5px' }}>Stock:</label>
                <input type="number" className="game-input" value={parseInt(stock)}
                    onChange={(e) => handleStock(game.id, e.target.value)} />
            </div>
            <div style={{ gap: '10px' }}>
                <label className="game-price-label" style={{ marginRight: '5px' }}>Prix:</label>
                <input type="number" className="game-input" value={parseFloat(price)} step={0.1}
                    onChange={(e) => handlePrice(game.id, e.target.value)} />
            </div>
            <button className="game-page-button" onClick={() => window.location.href = `/admin/games/${game.id}`}>Voir le jeu</button>
        </div>
    );
}

export default Game;