import { useCart } from '../../CartContext';
import './Item.css';

function Item({ item }) {
    const { canBePurchased } = useCart();
    const { addToCart, removeFromCart, removeAllFromCart } = useCart();

    return (
        <div className="item-container">
            <div className="item-info">
                <img src={item.image.path} alt={item.name} className="image" />
                <div className="info-cart">
                    <label className="name">{item.name}</label>
                    <label className="description">{item.description}</label>
                </div>
            </div>
            <div className="quantity">
                <button onClick={() => removeFromCart(item.name)}
                    disabled={item.quantity === 1} className="quantity_btn">-</button>
                <label className="quantity_label">{item.quantity}</label>
                <button onClick={() => addToCart(item)} className="quantity_btn" disabled={!canBePurchased(item)}>+</button>
            </div>
            <div className="price">
                <label className="price_label">{item.price.toFixed(2)} €</label>
                <label className="total_price">{(item.price * item.quantity).toFixed(2)} €</label>
            </div>
            <button className="remove" onClick={() => removeAllFromCart(item.name)}>x</button>
        </div>
    );
}

export default Item;