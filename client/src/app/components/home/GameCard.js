import './GameCard.css'
import shop from '../../../res/icon/shopping-cart.png'
import React from 'react';
import TooltipInfo from '../TooltipInfo';

import { useCart } from '../../CartContext';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


function GameCard(props) {
    var game = props.c_game;
    const { addToCart, canBePurchased } = useCart();

    const { name, id, price, image } = game;
    const image_path = image && image["path"];

    const purchase = () => {
        console.log(canBePurchased(game));
        if (canBePurchased(game)) {
            addToCart(game);
        } else {
            alert("Désolé, ce jeu n'est plus disponible en stock.");
        }
    }

    return (
        <div className="home-game-card">
            <label className="game-card-title">{name}</label>
            <img src={image_path} alt={name} className="game-card-image" />
            <div className="game-card-buy">
                <p className="game-card-price">Prix : {price}€</p>
                {
                    canBePurchased(game) ?
                        <button className="game-card-button" onClick={() => purchase()}>
                            <img src={shop} alt="Ajouter au panier" className='game-card-button-icon' />
                        </button>
                        :
                        <TooltipInfo text="Désolé, ce jeu n'est plus disponible en stock. 😢" position="right">
                            <button className="game-card-button-disabled">
                                <img src={shop} alt="Ajouter au panier" className='game-card-button-icon' />
                            </button>
                        </TooltipInfo>
                }

            </div>
            <Link to={`/detail/${id}`} className="game-card-link">En savoir plus</Link>
        </div>
    );
}

export default GameCard;