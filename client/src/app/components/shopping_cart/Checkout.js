import { useCart } from '../../CartContext';
import { useState } from 'react';

import './Checkout.css';

const Checkout = ({ deliveryMethod, total, setCheckout }) => {
    const { cart, clearCart } = useCart();
    const [name, setName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');

    const [error, setError] = useState('');

    const handleCheckout = async (e) => {
        e.preventDefault(); // Prevent default form submission

        console.log('Checkout:', name, paymentMethod, zipcode, country, address, deliveryMethod);

        if (!name || !paymentMethod || !zipcode || !country || !address || !deliveryMethod) {
            setError('Please fill in all fields.');
            return;
        }

        // Payment method need to be selected
        if (paymentMethod === '') {
            setError('Please select a payment method.');
            return;
        }

        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        const items = cart.map((item) => ({
            item_id: item.id,
            quantity: item.quantity,
            isDigital: item.isDigital || true
        }));

        const order = {
            user: userId,
            name,
            country,
            zipcode,
            address,
            paymentMode: paymentMethod,
            state: 'CONFIRMED',
            deliveryMethod: deliveryMethod.id,
            total,
            items
        };

        try {
            const response = await fetch('http://localhost:3001/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                throw new Error('Failed to create order. ' + response.statusText);
            }

            const result = await response.json();
            alert('Order successfully placed!');
            clearCart();
            setCheckout(false);
        } catch (error) {
            setError('Failed to place order. ' + error.message);
        }
    };

    return (
        <div className="checkout-container">
            <h1 className="checkout-title">Checkout</h1>
            <p className="checkout-total">Total: ${total}</p>
            <form className="checkout-form" onSubmit={handleCheckout}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />

                <label htmlFor="paymentMethod">Payment Method:</label>
                <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
                    <option value="">Select Payment Method</option>
                    <option value="PAYPAL">Paypal</option>
                    <option value="CB">Credit Card</option>
                </select>

                <label htmlFor="zipcode">Zipcode:</label>
                <input type="text" id="zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} required />

                <label htmlFor="address">Address:</label>
                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />

                <label htmlFor="country">Country:</label>
                <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />

                <button type="submit">Checkout</button>
                {error && <p className="checkout-error">{error}</p>}
            </form>
            <button onClick={() => setCheckout(false)} className="checkout-cancel">Cancel</button>
        </div>
    );
};

export default Checkout;
