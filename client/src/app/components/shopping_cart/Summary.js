import { useCart } from "../../CartContext";
import { useState } from "react";
import './Summary.css';

function Summary(props) {
    const { cart } = useCart();

    const { deliveryMethods, setCheckout, setDeliveryMethod, setTotal, applyDiscount } = props;
    let { deliveryMethod } = props;
    const [deliveryCharge, setDeliveryCharge] = useState(deliveryMethod ? deliveryMethod.cost : 0);
    const [discount, setDiscount] = useState(null);
    const [discountError, setDiscountError] = useState('');

    if (!deliveryMethod && deliveryMethods.length > 0) {
        deliveryMethod = deliveryMethods[0];
        setDeliveryMethod(deliveryMethod);
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const localyApplyDiscount = (discountName) => {
        if (!discountName) {
            setDiscountError("S\'il vous plaît, entrez un code de réduction valide");
            return;
        }
        if (discount) {
            setDiscountError('Un code de réduction a déjà été appliqué');
            return;
        }

        fetch('http://localhost:3001/discount-codes/name/' + discountName)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setDiscountError('Code de réduction invalide');
                    return;
                }

                setDiscount(data);
                setDiscountError('');
                console.log('Discount applied:', data);
            });
    }


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
                            setDeliveryMethod(deliveryMethods.find((method) => method.id === parseInt(e.target.value)));
                            setDeliveryCharge(parseFloat(e.target.value));
                        }}>
                        {deliveryMethods.map((method) => (
                            method.available ? (
                                <option key={method.id} value={method.cost} selected={deliveryMethod.id === method.id}>
                                    {method.name} - {method.cost.toFixed(2)} €
                                </option>
                            ) : null
                        ))}
                    </select>
                </div>
                <div className="summary-item" >
                    <span className="summary-discount">Discount code</span>
                    <input type="text" placeholder="Enter your code" className="summary-input" id="discount-code" />
                    <button className="summary-apply"
                        onClick={() => {
                            localyApplyDiscount(document.getElementById('discount-code').value);
                        }}>Apply</button>
                    {discountError && <span className="discount-error">{discountError}</span>}
                </div>
            </div>
            <div className="summary-item total">
                <label className="total-label">Total</label>

                <div className="total-amount-container">
                    <label className="total-amount">
                        {(total + deliveryCharge).toFixed(2)} €
                    </label>
                    {
                        discount && (
                            <label className="discount-total">
                                - {((total + deliveryCharge) * discount.value / 100).toFixed(2)} €
                            </label>
                        )
                    }
                </div>
            </div>
            <button className="checkout"
                disabled={cart.length === 0}
                onClick={() => {
                    setTotal((total + deliveryCharge - (discount ? (total + deliveryCharge) * discount.value / 100 : 0)).toFixed(2));
                    setCheckout(true);
                    discount && applyDiscount(discount);
                }}>Checkout</button>
        </div>
    );
}

export default Summary;