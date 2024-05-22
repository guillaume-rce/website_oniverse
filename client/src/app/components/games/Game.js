import './Game.css';

const Game = ( { game, addToCart, height } ) => {
    return (
        <div className="game-card-component" style={{ height: height }}>
            <img className="game-image" src={game.logo.path} alt={game.name} />
            <div className="game-info">
                <label className="game-name">{game.name}</label>
                <label className="game-price">{game.price} €</label>
                <button className="game-add" onClick={() => addToCart(game)}>Add to cart</button>
            </div>
        </div>
    );
}

export default Game;