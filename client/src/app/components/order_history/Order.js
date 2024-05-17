import { useState, useEffect } from 'react';
import Item from './Item';
import CB from '../../../res/icon/CB.png';
import Paypal from '../../../res/icon/paypal.png';
import './Order.css';
import OrderTimeline from './OrderTimeline';

const Order = ({ order }) => {
    const [items, setItems] = useState([]);
    const [deliveryMethod, setDeliveryMethod] = useState("");
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/orders/items/${order.id}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setItems(data);
                } else {
                    console.error('Expected an array, but received:', data);
                    setItems([]);  // Set to empty array if not array
                }
            })
            .catch(error => {
                console.error('Failed to fetch items for order', order.id, error);
                setError('Failed to fetch items for order');
                setItems([]);  // Ensure items is always an array
            });
    }, [order.id]);

    useEffect(() => {
        fetch(`http://localhost:3001/delivery/${order.deliveryMethod}`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch delivery method', order.deliveryMethod, error);
                    setError('Failed to fetch delivery method');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No delivery method found for order', order.deliveryMethod);
                    return;
                }
                setDeliveryMethod(data.name);
            });
    }, [order.deliveryMethod]);

    if (!deliveryMethod || items.length === 0) {
        return;
    }

    console.log(items);

    const timeAgo = (dateTime) => {
        const diff = new Date() - new Date(dateTime);
        const seconds = Math.floor(diff / 1000);
        const intervals = [
            { seconds: 31536000, label: 'year' },
            { seconds: 2592000, label: 'month' },
            { seconds: 86400, label: 'day' },
            { seconds: 3600, label: 'hour' },
            { seconds: 60, label: 'minute' }
        ];

        for (let i = 0; i < intervals.length; i++) {
            const interval = Math.floor(seconds / intervals[i].seconds);
            if (interval >= 1) {
                return interval + ' ' + intervals[i].label + (interval > 1 ? 's' : '') + ' ago';
            }
        }
        return seconds + ' seconds ago';
    };

    return (
        <div className="order-history-details">
            <div className="order-history-header">
                <label>Order ID: #{order.id}</label>
                <label>Total: {order.total} €</label>
                <div className="payment-method">
                    <label>Payment Mode:</label>
                    {order.paymentMode === 'CB' ?
                        <img src={CB} alt="CB" className="method-icon" /> :
                        <img src={Paypal} alt="Paypal" className="method-icon" />}
                </div>
                <label>Ordered {timeAgo(order.creationDateTime)}</label>
            </div>
            <div className="order-history-delivery">
                <label className="order-history-method">{deliveryMethod}</label>
                <OrderTimeline order={order} />
            </div>
            <div className="order-history-items">
                {items.map((item) => (
                    <Item key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

export default Order;