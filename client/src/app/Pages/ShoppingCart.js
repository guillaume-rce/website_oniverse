import { useState, useEffect } from 'react';
import './ShoppingCart.css';
import ItemsCart from '../components/shopping_cart/ItemsCart';
import Summary from '../components/shopping_cart/Summary';
import Checkout from '../components/shopping_cart/Checkout';

const ShoppingCart = () => {
    const [checkout, setCheckout] = useState(false);
    const [total, setTotal] = useState(0);
    const [deliveryMethod, setDeliveryMethod] = useState();
    const [deliveryMethods, setDeliveryMethods] = useState();
    const [discount, setDiscount] = useState(null);

    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');

    useEffect(() => {
        fetch('http://localhost:3001/delivery')
            .then((response) => response.json())
            .then((data) => {
                if (data.length === 0) {
                    console.error('No delivery methods found');
                    return <div>There is an issue. Please try again later.</div>;
                }

                setDeliveryMethods(data);
                setDeliveryMethod(data[1]);
            });
    }, []);

    if (!deliveryMethods) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{height: '100%', width: '100%'}}>
            {!checkout ? (
                <div className="shopping-cart-details">
                    <ItemsCart />
                    <Summary deliveryMethods={deliveryMethods} deliveryMethod={deliveryMethod}
                        setDeliveryMethod={setDeliveryMethod} setCheckout={
                            // Verify if the user is connected
                            userId ? setCheckout : () => window.location.href = '/auth'
                        } setTotal={setTotal} applyDiscount={setDiscount} />

                </div>
            ) : (
                <Checkout deliveryMethod={deliveryMethod} total={total} discount={discount} setCheckout={setCheckout} />
            )}
        </div>
    );
};

export default ShoppingCart;
