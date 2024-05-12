import { useState, useEffect } from 'react';
import HorizontalTimeline from "react-horizontal-timeline";
import Item from './Item';
import './Order.css';

const Order = ({ order }) => {
    const [items, setItems] = useState([]);
    const [deliveryMethod, setDeliveryMethod] = useState("");
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/orders/items/${order.id}`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch items for order', order.id, error);
                    setError('Failed to fetch items for order');
                }
            )
            .then((data) => {
                if (data.length === 0) {
                    console.error('No items found for order', order.id);
                    return;
                }
                setItems(data);
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

    const renderTimeline = () => {
        const isMitigated = order.state === "MITIGE";
        const timelineColor = isMitigated ? "red" : "green";
        const states = ["Confirmed", "In preparation", "Sent", "Received", "Closed"]
        // Capitalize and replace underscore with space for database compatibility
        const currentState = order.state.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()).replace("_", " ");
        const stateIndex = states.indexOf(currentState);

        return (
            <div className="timeline-container">
                <div className="timeline-line" />
                <div className="timeline-items-container">
                    {states.map((state, index) => (
                        <div key={state} className="timeline-item-container">
                            <label>{state}</label>
                            <div key={state}
                                className={`timeline-item ${index <= stateIndex ? 'active' : ''}`}
                                style={{ backgroundColor: index <= stateIndex ? timelineColor : '#ccc' }} />
                            {index === stateIndex && <label className="timeline-update-date">{formatDate(order.lastUpdateDateTime)}</label>}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (items.length === 0) {
        return <div>Loading...</div>;
    }

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

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleDateString();
    };

    return (
        <div className="order-details">
            <div className="order-header">
                <label>Order ID: #{order.id}</label>
                <label>Total: {order.total} €</label>
                <label>Payment Mode: {order.paymentMode}</label>
                <label>Ordered {timeAgo(order.creationDateTime)}</label>
            </div>
            <div className="order-delivery">
                <label className="order-method">{deliveryMethod}</label>
                {renderTimeline()}
            </div>
            <div className="order-items">
                {items.map((item) => (
                    <Item key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

export default Order;