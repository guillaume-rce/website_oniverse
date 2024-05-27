import './GamePres.css'
import { useCart } from '../../CartContext';
import { useEffect, useRef } from 'react';

function GamePres({ game }) {
    const { name, description, image } = game;
    const { addToCart } = useCart();

    const buttonRef = useRef(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (buttonRef.current && !buttonRef.current.matches(':hover')) {
                createSparkle(buttonRef.current);
            }
        }, 1000);
    
        return () => clearInterval(intervalId);
    }, []);    

    const createSparkle = (button) => {
        const numberOfSparkles = 5;
        for (let i = 0; i < numberOfSparkles; i++) {
            const sparkle = document.createElement("span");
            const size = Math.random() * (8 - 2) + 2;
            const position = Math.random() * (button.clientWidth - size);
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            sparkle.style.left = `${position}px`;
            sparkle.style.top = `${Math.random() * (button.clientHeight - size)}px`;
            sparkle.className = 'sparkle';
            button.appendChild(sparkle);
    
            setTimeout(() => sparkle.remove(), 1500);
        }
    };    

    const handleRippleEffect = (e) => {
        const button = e.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
    
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - radius;
        const y = e.clientY - rect.top - radius;
    
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
        circle.style.position = 'absolute';
        circle.style.borderRadius = '50%';
        circle.style.background = 'rgba(255, 255, 255, 0.3)';
        circle.style.transform = 'scale(0)';
        circle.style.animation = 'ripple 0.6s linear';
        button.appendChild(circle);
    
        setTimeout(() => circle.remove(), 600);
    }    

    return (
        <div className="GamePres" style={{ backgroundImage: `url(${image["path"]})` }}>
            <div className="GamePres_overlay">
                <p className="GamePres_title">{name}</p>
                <p className="GamePres_desc">{description}</p>
                <button className="GamePres_add" ref={buttonRef} onClick={(e) => {addToCart(game); handleRippleEffect(e);}}>Ajouter au panier</button>
            </div>
        </div>
    );
}

export default GamePres;
