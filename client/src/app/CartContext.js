import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (game) => {
        // Add the game to the cart and increment the quantity if it's already in the cart
        setCart((currentCart) => {
            const index = currentCart.findIndex((cartGame) => cartGame.name === game.name);
            if (index === -1) {
                return [...currentCart, { ...game, quantity: 1 }];
            }
            return [
                ...currentCart.slice(0, index),
                { ...currentCart[index], quantity: currentCart[index].quantity + 1 },
                ...currentCart.slice(index + 1),
            ];
        });
    };

    const removeFromCart = (gameTitle) => {
        // Remove the game from the cart and decrement the quantity if it's in the cart
        setCart((currentCart) => {
            const index = currentCart.findIndex((game) => game.name === gameTitle);
            if (index === -1) {
                return currentCart;
            }
            if (currentCart[index].quantity === 1) {
                return [...currentCart.slice(0, index), ...currentCart.slice(index + 1)];
            }
            return [
                ...currentCart.slice(0, index),
                { ...currentCart[index], quantity: currentCart[index].quantity - 1 },
                ...currentCart.slice(index + 1),
            ];
        });
    };

    const removeAllFromCart = (gameTitle) => {
        // Remove all instances of the game from the cart
        setCart((currentCart) => currentCart.filter((game) => game.name !== gameTitle));
    }

    /*
    The cart looks like this:
    [
        { title: 'Game 1', price: 10, quantity: 2 },
        { title: 'Game 2', price: 20, quantity: 1 },
    ]
    */
    const value = {
        cart,
        addToCart,
        removeFromCart,
        removeAllFromCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
