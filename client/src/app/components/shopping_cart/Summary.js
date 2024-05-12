import { useCart } from "../../CartContext";
import { useState } from "react";
import './Summary.css';

function Summary(props) {
    const { cart } = useCart();
    const [deliveryCharge, setDeliveryCharge] = useState(0);

    const { deliveryMethods, deliveryMethod, setCheckout, setDeliveryMethod, setTotal } = props;

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="summary">
            <label className="summary-title">Summary</label>
            <div className="summary-item main">
                <div className="summary-item subtotal">
                    <label>Total for {cart.length} items</label>
                    <label>{total.toFixed(2)} €</label>
                </div>
                <div className="summary-item">
                    <label className="summary-shipping">Delivery method</label>
                    <label className="summary-shipping-info">Every digital purchase is delivered by email, it is free of charge.</label>
                    <select className="summary-input"
                        onChange={(e) => {
                            setDeliveryMethod(parseInt(e.target.key));
                            setDeliveryCharge(parseFloat(e.target.value));
                        }}>
                        {deliveryMethods.map((method) => (
                            method.available ? (
                                <option key={method.id} value={method.cost} selected={deliveryMethod === method.id}>
                                    {method.name} - {method.cost.toFixed(2)} €
                                </option>
                            ) : null
                        ))}
                    </select>
                </div>
                <div className="summary-item" >
                    <span className="summary-discount">Discount code</span>
                    <input type="text" placeholder="Enter your code" className="summary-input" />
                </div>
            </div>
            <div className="summary-item total">
                <span>Total</span>
                <span>{(total + deliveryCharge).toFixed(2)} €</span>
            </div>
            <button className="checkout"
                disabled={cart.length === 0 || !deliveryMethod}
                onClick={() => {
                    setTotal((total + deliveryCharge).toFixed(2));
                    setCheckout(true);
                }}>Checkout</button>
        </div>
    );
}

export default Summary;