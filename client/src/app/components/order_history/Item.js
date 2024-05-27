import { useEffect, useState } from 'react';

import './Item.css';
import { useCart } from '../../CartContext';

const Item = ({ key, item }) => {
    const { item_id, quantity, isDigital } = item;
    const [ product, setProduct ] = useState({});
    const [ error, setError ] = useState('');

    const { addToCart } = useCart();

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
            {product.image && <img src={product.image.path} alt={product.name} />}
            <div className="order-item-details">
                <label className="order-item-name">{product.name}</label>
                <label className="order-item-quantity">Quantity: {quantity}</label>
            </div>
            <button className="order-item-reorder" onClick={() => addToCart(product)}>Reorder</button>
        </div>
    );
};

export default Item;