import { useEffect, useState } from 'react';
import Order from '../../components/admin/Order';
import './AdminOrders.css';
import { CartProvider } from '../../CartContext';
import Header from '../../components/Header';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/orders?sortOrder=asc')
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch orders', error);
                    setError('Failed to fetch orders');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No orders found');
                    return;
                }

                setOrders(data);
            });
    }, []);

    if (!orders) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-orders">
            <CartProvider>
                <Header hide={false} />
            </CartProvider>
            <label style={{ fontSize: '3em', color: '#fff', fontWeight: 'bold' }}
                className="title">Toutes les commandes</label>
            <div className="orders">
                {orders.map((order) => (
                    <Order key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}

export default AdminOrders;