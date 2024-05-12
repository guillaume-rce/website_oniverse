import { useEffect, useState } from 'react';
import Order from '../components/order_history/Order';

import './OrderHistory.css';

const OrderHistory = () => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');

    const [orders, setOrders] = useState();
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/orders/user/${userId}`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch orders', error);
                    setError('Failed to fetch orders');
                }
            )
            .then((data) => {
                if (data.length === 0) {
                    console.error('No orders found');
                    return;
                }

                setOrders(data);
            });
    }, []);

    if (!orders || orders.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="order-history">
            <h1>Order History</h1>
            <div className="orders">
                {orders.map((order) => (
                    <Order key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}

export default OrderHistory;