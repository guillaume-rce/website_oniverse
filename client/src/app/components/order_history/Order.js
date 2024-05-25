import { useState, useEffect } from 'react';
import Item from './Item';
import CB from '../../../res/icon/CB.png';
import Paypal from '../../../res/icon/paypal.png';
import './Order.css';
import OrderTimeline from './OrderTimeline';

const Order = ({ order }) => {
    const [items, setItems] = useState([]);
    const [deliveryMethod, setDeliveryMethod] = useState("");
    const [orderDetails, setOrderDetails] = useState(order);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/orders/items/${orderDetails.id}`)
            .then(response => response.json())
            .then(data => {
                if (data.error && data.error !== 'No items found for this order.') {
                    console.error('Failed to fetch items for order', orderDetails.id, data.error);
                    setError('Failed to fetch items for order');
                    setItems([]);  // Ensure items is always an array
                    return;
                }
                if (data.error === 'No items found for this order.' || !data) {
                    setItems([]);
                    console.log('No items found for order', orderDetails.id);
                    return;
                }

                if (Array.isArray(data)) {
                    setItems(data);
                } else {
                    console.error('Expected an array, but received:', data);
                    setItems([]);  // Set to empty array if not array
                }
            })
            .catch(error => {
                console.error('Failed to fetch items for order', orderDetails.id, error);
                setError('Failed to fetch items for order');
                setItems([]);  // Ensure items is always an array
            });
    }, [orderDetails.id]);

    useEffect(() => {
        fetch(`http://localhost:3001/delivery/${orderDetails.deliveryMethod}`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch delivery method', orderDetails.deliveryMethod, error);
                    setError('Failed to fetch delivery method');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No delivery method found for order', orderDetails.deliveryMethod);
                    return;
                }
                setDeliveryMethod(data.name);
            });
    }, [orderDetails.deliveryMethod]);

    if (!deliveryMethod || items.length === 0) {
        return;
    }

    const timeAgo = (dateTime) => {
        const diff = new Date() - new Date(dateTime);
        const seconds = Math.floor(diff / 1000);
        const intervals = [
            { seconds: 31536000, label: 'année' },
            { seconds: 2592000, label: 'mois' },
            { seconds: 86400, label: 'jour' },
            { seconds: 3600, label: 'heure' },
            { seconds: 60, label: 'minute' }
        ];

        for (let i = 0; i < intervals.length; i++) {
            const interval = Math.floor(seconds / intervals[i].seconds);
            if (interval >= 1) {
                return interval + ' ' + intervals[i].label + ((intervals[i].label != 'mois' && interval > 1) ? 's' : '') + '';
            }
        }
        return seconds + ' secondes';
    };

    const enterMitigate = () => {
        fetch(`http://localhost:3001/orders/${orderDetails.id}/advance-state`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nextState: 'MITIGE'
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Failed to advance order state:', data.error);
                    setError('Failed to advance order state');
                    return;
                }
                console.log('Order state advanced:', data);
                const newOrder = { ...orderDetails, state: 'MITIGE' };
                setOrderDetails(newOrder);
            })
            .catch(error => {
                console.error('Failed to advance order state:', error);
                setError('Failed to advance order state');
            });
    };


    return (
        <div className="order-history-details">
            <div className="order-history-header">
                <label>Commande: #{orderDetails.id}</label>
                <label>Total : {orderDetails.total} €</label>
                <div className="payment-method">
                    <label>Mode de payement :</label>
                    {orderDetails.paymentMode === 'CB' ?
                        <img src={CB} alt="CB" className="method-icon" /> :
                        <img src={Paypal} alt="Paypal" className="method-icon" />}
                </div>
                <label>Commandé il y a {timeAgo(orderDetails.creationDateTime)}</label>
            </div>
            <div className="order-history-delivery">
                <label className="order-history-method">{deliveryMethod}</label>
                <OrderTimeline order={orderDetails} />
            </div>
            {orderDetails.state === 'MITIGE' ?
                <label className="order-history-mitigated">Vous avez signalé un problème... Args ! 😢<br/>Nous allons vous contacter par email.</label> :
                <button className="order-history-mitigate" onClick={enterMitigate}>Signaler un problème... 😢</button>
            }
            <div className="order-history-items">
                {items.map((item) => (
                    <Item key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

export default Order;