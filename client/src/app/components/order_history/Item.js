import { useEffect, useState } from 'react';
import buy from '../../../res/icon/shopping-cart.png';

import './Item.css';
import { useCart } from '../../CartContext';
import TooltipInfo from '../TooltipInfo';

const Item = ({ key, item }) => {
    const { item_id, quantity, isDigital } = item;
    const [product, setProduct] = useState({});
    const [error, setError] = useState('');

    const { addToCart, canBePurchased } = useCart();

    useEffect(() => {
        if (isDigital) {
            fetch(`http://localhost:3001/games/${item_id}`)
                .then(
                    (response) => response.json(),
                    (error) => {
                        console.error('Failed to fetch product', item_id, error);
                        setError('Failed to fetch product');
                    }
                )
                .then((data) => {
                    if (!data) {
                        console.error('No product found for item', item_id);
                        return;
                    }

                    setProduct(data);
                });
        }
    }, []);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="order-item">
            <div className="order-item-details-container">
                {product.image && <img src={product.image.path} alt={product.name} className="order-item-image" />}
                <div className="order-item-details">
                    <label className="order-item-name">{product.name}</label>
                    <label className="order-item-quantity">Quantity: {quantity}</label>
                </div>
            </div>
            {
                canBePurchased(product) ?
                    <button className="order-item-reorder" onClick={() => addToCart(product)}>
                        <img src={buy} alt="Reorder" className="order-item-reorder-icon" />
                    </button>
                    :
                    <TooltipInfo text="Désolé, ce jeu n'est plus disponible en stock. 😢" position="left">
                        <button className="order-item-reorder-disabled">
                            <img src={buy} alt="Reorder" className="order-item-reorder-icon" />
                        </button>
                    </TooltipInfo>
            }
        </div>
    );
};

export default Item;