import React, { useEffect, useState } from 'react';
import './GamePres.css';
import { motion } from 'framer-motion'; // Import Framer Motion

// Importation des icônes
import leftArrow from '../../../res/icon/left-arrow.png';
import rightArrow from '../../../res/icon/right-arrow.png';
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

    const buttonVariants = {
        animate: {
            borderColor: ["rgba(255, 216, 33, 0.8)", "rgba(255, 164, 21, 0.8)", "rgba(255, 216, 33, 0.8)"],
            boxShadow: ["0 0 8px rgba(255, 216, 33, 0.8)", "0 0 8px rgba(255, 164, 21, 0.8)", "0 0 8px rgba(255, 216, 33, 0.8)"],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
            }
        },
        hover: {
            scale: 1.1,
            borderColor: "rgba(255, 216, 33, 0.8)",
            boxShadow: "0 0 8px rgba(255, 216, 33, 0.8)",
            transition: {
                duration: 0.3
            }
        }
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

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
                <motion.button
                    onClick={() => window.location.href = `/detail/${id}`}
                    className="home-gamepres_button"
                    style={{ color: titleColor }}
                    variants={buttonVariants}
                    animate="animate"
                    whileHover="hover"
                >
                    En savoir plus
                </motion.button>
            </div>
            {(games.length > 1) && (
                <button className="home-gamepres_arrow right" onClick={() => activeIndex < games.length - 1 ? setActiveIndex(activeIndex + 1) : setActiveIndex(0)}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                    <img src={rightArrow} alt="Next" className='home-gamepres_arrow_img' style={{ filter: invertValue }} />
                </button>
            )}
            <motion.button className="home-gamepres_scroll_down" onClick={scrollToBottom}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                <motion.svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                >
                    <path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="#ffa415" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="white"/>
                </motion.svg>
            </motion.button>
        </div>
    );
}

export default GamePres;
