import './Game.css';

const Game = ({ game }) => {
    const fontColor = game.image.isLight ? 'black' : 'white';
    const backgroundColor = game.image.isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';

    return (
        <div className="game" key={game.id} style={{ backgroundImage: `url(${game.image.path})` }}>
            <div className="game-titlebg" style={{ backgroundColor: backgroundColor }}>
                <label className="game-title" style={{ fontColor }}>{game.name}</label>
            </div>
        </div>
    );
}

export default Game;
