import { useState, useEffect } from 'react';
import './ShoppingCart.css';
import { CartProvider } from '../CartContext';
import ItemsCart from '../components/shopping_cart/ItemsCart';
import Summary from '../components/shopping_cart/Summary';
import Checkout from '../components/shopping_cart/Checkout';

const ShoppingCart = () => {
    const [checkout, setCheckout] = useState(false);
    const [total, setTotal] = useState(0);
    const [deliveryMethod, setDeliveryMethod] = useState();
    const [deliveryMethods, setDeliveryMethods] = useState();

    useEffect(() => {
        fetch('http://localhost:3001/delivery')
            .then((response) => response.json())
            .then((data) => {
                if (data.length === 0) {
                    console.error('No delivery methods found');
                    return <div>There is an issue. Please try again later.</div>;
                }

                setDeliveryMethods(data);
                setDeliveryMethod(data[1].id);
            });
    }, []);

    if (!deliveryMethods) {
        return <div>Loading...</div>;
    }

    return (
        <CartProvider>
            {!checkout ? (
                <div className="shopping-cart-details">
                    <ItemsCart />
                    <Summary deliveryMethods={deliveryMethods} deliveryMethod={deliveryMethod}
                        setDeliveryMethod={setDeliveryMethod} setCheckout={setCheckout} setTotal={setTotal} />
                </div>
            ) : (
                <Checkout deliveryMethod={deliveryMethod} total={total} setCheckout={setCheckout} />
            )}
        </CartProvider>
    );
};

export default ShoppingCart;
