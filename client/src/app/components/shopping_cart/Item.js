import { useCart } from '../../CartContext';

function Item({ item }) {
    const { addToCart, removeFromCart, removeAllFromCart } = useCart();

    return (
        <div className="item">
            <img src={item.image} alt={item.name} />
            <div>
                <p>{item.name}</p>
                <p>{item.description}</p>
            </div>
            <div className="quantity">
                <button onClick={() => removeFromCart(item.name)}>-</button>
                <input type="number" value={item.quantity} readOnly />
                <button onClick={() => addToCart(item)}>+</button>
            </div>
            <p>€ {item.price}</p>
            <p>€ {item.price * item.quantity}</p>
            <button className="remove" onClick={() => removeAllFromCart(item.name)}>x</button>
        </div>
    );
}

export default Item;