import './GamePres.css'

function GamePres({ game }) {
    const { name, description, image } = game;

    return (
        <div className="GamePres" style={{ backgroundImage: `url(${image["path"]})` }}>
            <div className="GamePres_overlay">
                <p className="GamePres_title">{name}</p>
                <p className="GamePres_desc">{description}</p>
            </div>
        </div>
    );
}

export default GamePres;