import './GameCard.css'
import shop from '../../../res/icon/shopping-cart.png'
import React, { useEffect, useState } from 'react';

import { useCart } from '../../CartContext';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


function GameCard(props) {
    var game = props.c_game;
    const { addToCart } = useCart();

    const { name, id, price, image } = game;
    const image_path = image && image["path"];
    return (
        <div className="home-game-card">
            <h2 className="game-card-title">{name}</h2>
            <img src={image_path} alt={name} className="game-card-image" />
            <div className="game-card-buy">
                <p className="game-card-price">Prix : {price}€</p>
                <button className="game-card-button" onClick={() => addToCart(game)}>
                    <img src={shop} alt="Ajouter au panier" className='game-card-button-icon' />
                </button>
            </div>
            <Link to={`/detail/${id}`} className="game-card-link">En savoir plus</Link>
        </div>
    );
}

export default GameCard;