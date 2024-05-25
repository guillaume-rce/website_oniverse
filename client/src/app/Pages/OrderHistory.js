import { useEffect, useState } from 'react';
import Order from '../components/order_history/Order';

import './OrderHistory.css';

const OrderHistory = () => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');

    if (!userId) {
        window.location.href = '/auth';
    }

    const [orders, setOrders] = useState(null);
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
            .then(data => {
                if (!data || (data.error && data.error !== 'No orders found for this user.')) { 
                    console.error('Failed to fetch orders', data.error);
                    setError('Failed to fetch orders');
                    return;
                }

                if (data.error === 'No orders found for this user.' || data.length === 0) {
                    setOrders([]);
                    console.log('No orders found');
                    return;
                }


                setOrders(data);
            });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!orders) {
        return <div>Loading...</div>;
    }

    return (
        <div className="order-history-background">
            <button className="back-button"
                onClick={() => window.history.back()}
            >{"< BACK"}</button>
            {
                orders.length > 0 && orders[0] !== 'empty' ?
                    <div className="order-history">
                        <label className='order-history-title'>Historique des commandes</label>
                        <div className="orders-history">
                            {orders.map((order) => (
                                <Order key={order.id} order={order} />
                            ))}
                        </div>
                    </div>
                    :
                    <div className="order-history">
                        <label className='order-history-title'>Pas de commandes</label>
                        <label className='order-history-subtitle'>Vous n'avez pas commandé de jeux ?! 😱</label>
                    </div>
            }
        </div>
    );
}

export default OrderHistory;