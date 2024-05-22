import './Game.css';

const Game = ( { game, addToCart, height } ) => {
    return (
        <div className="game-card-component" style={{ height: height }}>
            <img className="game-image-component" src={game.logo? game.logo.path : game.image.path} alt={game.name} />
            <div className="game-info-component">
                <label className="game-name-component">{game.name}</label>
                <label className="game-price-component">{game.price}€</label>
                <div className="game-tags-component">
                    {game.tags.map((tag) => (
                        <label key={tag.id} className="game-tag-component">{tag.name}</label>
                    ))}
                </div>
            </div>
            <button className='game-add-component' id={game.id} onClick={() => {
                addToCart(game);
                const element = document.getElementById(game.id);
                element.classList.add('added-to-cart')
                setTimeout(() => {
                    element.classList.remove('added-to-cart')
                }, 100);
            }}>Ajouter au panier</button>
        </div>
    );
}

export default Game;