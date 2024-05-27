import React, { useEffect, useState } from 'react';
import './GamePres.css';

// Importation des icônes
import leftArrow from '../../../res/icon/left-arrow.png'
import rightArrow from '../../../res/icon/right-arrow.png'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


function GamePres() {
    const [games, setGames] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    
    useEffect(() => {
        fetch('http://localhost:3001/games')
        .then(response => response.json())
        .then(data => {
            setGames(data);
        })
        .catch(error => console.error('Erreur lors de la récupération des jeux :', error));
    }, []);

    if (games === undefined || games.length === 0) {
        return (<div>Chargement...</div>);
    }

    const { name, id, image } = games[activeIndex];
    const isLight = image?.isLight;
    const titleColor = isLight ? 'black' : 'white';
    const invertValue = isLight ? 'invert(0)' : 'invert(1)';

    return (
        <div className="home-gamepres_container" style={image && { backgroundImage: `url(${image["path"]})` }}>
            {(games.length > 1) && (
                <button className="home-gamepres_arrow left" onClick={() => activeIndex > 0 ? setActiveIndex(activeIndex - 1) : setActiveIndex(games.length - 1)}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                    <img src={leftArrow} alt="Previous" className='home-gamepres_arrow_img' style={{ filter: invertValue }} />
                </button>
            )}
            <div className="home-gamepres_overlay">
                <label className="home-gamepres_title" style={{ color: titleColor }}>{name}</label>
                <Link to={`/detail/${id}`} className="home-gamepres_button" style={{ color: titleColor }}>En savoir plus</Link>
            </div>
            {(games.length > 1) && (
                <button className="home-gamepres_arrow right" onClick={() => activeIndex < games.length - 1 ? setActiveIndex(activeIndex + 1) : setActiveIndex(0)}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                    <img src={rightArrow} alt="Next" className='home-gamepres_arrow_img' style={{ filter: invertValue }} />
                </button>
            )}
        </div>
    );
}

export default GamePres;
