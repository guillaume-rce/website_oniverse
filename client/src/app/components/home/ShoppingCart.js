import React from 'react';
import './ShoppingCart.css';
import { useCart } from '../../CartContext';

function ShoppingCart() {
    // Utilisation du hook useCart pour accéder au panier et aux fonctions pour le modifier
    const { cart, removeFromCart } = useCart();

    // Calcul du total du panier arrondi à 2 décimales
    const totalPrice = cart.reduce((acc, game) => acc + game.price * game.quantity, 0).toFixed(2);

    return (
        <div className="shopping-cart">
            <h1 className="shopping-cart-title">Panier</h1>
            {
                cart.length === 0 ? (
                    <p className="shopping-cart-empty">Votre panier est vide</p>
                ) : <ul className="shopping-cart-list">
                    {cart.map((game, index) => (
                        <li key={index} className="shopping-cart-list-item">
                            <div className="shopping-cart-list-item-container">
                                <span className="shopping-cart-list-item-title">{game.name}</span>
                                <div className="shopping-cart-list-item-quantity">
                                    <span className="shopping-cart-list-item-quantity-text">{game.quantity}</span>
                                    <span className="shopping-cart-list-item-quantity-text">x</span>
                                    <span className="shopping-cart-list-item-price">{game.price}€</span>
                                </div>
                            </div>
                            <button
                                className="shopping-cart-list-item-rm"
                                onClick={() => removeFromCart(game.name)}
                            />
                        </li>
                    ))}
                </ul>
            }
            <p className="shopping-cart-total">Total : {totalPrice}€</p>
            <button className="shopping-cart-view-cart"
                onClick={() => window.location.href = '/shopping-cart'}>Voir le panier</button>
        </div>
    );
}

export default ShoppingCart;
