import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

import './AdminOrder.css';
import { CartProvider } from '../../CartContext';
import Header from '../../components/Header';

import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import OrderTimeline from '../../components/order_history/OrderTimeline';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminOrder = () => {
    var { id } = useParams();
    const [order, setOrder] = useState(null);
    const [user, setUser] = useState(null);
    const [delivery, setDelivery] = useState(null);
    const [items, setItems] = useState(null);

    const [digitalItems, setDigitalItems] = useState([]);
    const [costDigitalItem, setCostDigitalItem] = useState(0);
    const [costPhysicalItem, setCostPhysicalItem] = useState(0);

    const [totalCost, setTotalCost] = useState(0);
    const ref = useRef();
    const [isAnimated, setIsAnimated] = useState(false);

    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/orders/${id}`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch order', error);
                    setError('Failed to fetch order');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No order found');
                    return;
                }

                setOrder(data);
            });

        fetch(`http://localhost:3001/orders/items/${id}`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch items', error);
                    setError('Failed to fetch items');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No items found');
                    return;
                }

                setItems(data);
            });

        if (order) {
            fetch(`http://localhost:3001/delivery/${order.deliveryMethod}`)
                .then(
                    (response) => response.json(),
                    (error) => {
                        console.error('Failed to fetch delivery', error);
                        setError('Failed to fetch delivery');
                    }
                )
                .then((data) => {
                    if (!data) {
                        console.error('No delivery found');
                        return;
                    }

                    setDelivery(data);
                });

            fetch(`http://localhost:3001/user/${order.user}`)
                .then(
                    (response) => response.json(),
                    (error) => {
                        console.error('Failed to fetch user', error);
                        setError('Failed to fetch user');
                    }
                )
                .then((data) => {
                    if (!data) {
                        console.error('No user found');
                        return;
                    }

                    setUser(data);
                });
        }

        if (items) {
            items.forEach((item) => {
                if (item.isDigital) {
                    fetch(`http://localhost:3001/games/${item.item_id}`)
                        .then(
                            (response) => response.json(),
                            (error) => {
                                console.error('Failed to fetch digital item', item.item_id, error);
                                setError('Failed to fetch digital item');
                            }
                        )
                        .then((data) => {
                            if (!data) {
                                console.error('No digital item found for item', item.item_id);
                                return;
                            }

                            // Ajouter l'item digital à la liste des items digitaux si l'item n'est pas déjà présent
                            if (!digitalItems.find((digitalItem) => digitalItem.id === data.id)) {
                                // add quantity to the item
                                data.quantity = item.quantity || 1;
                                setDigitalItems([...digitalItems, data]);
                            }
                        }
                        );
                }
            });
        }
    }, [id, order]);

    useEffect(() => {
        if (!digitalItems) {
            return;
        }

        let totalCost = 0;
        digitalItems.forEach((digitalItem) => {
            totalCost += digitalItem.price * digitalItem.quantity;
        });
        setCostDigitalItem(totalCost);
    }, [digitalItems]);

    const annimateValue = (start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setTotalCost(Math.floor(progress * (end - start) + start));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isAnimated) {
                    annimateValue(0, order.total, 500);
                    setIsAnimated(true);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [order, isAnimated]);

    if (!order || !delivery || !items || !user) {
        return <div>Loading...</div>;
    }

    const formatDate = (date) => {
        const dateObj = new Date(date);
        return `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
    }

    const data = [
        { name: 'Livraison (€)', value: delivery.cost },
        { name: 'Item digital (€)', value: costDigitalItem },
        { name: 'Item physique (€)', value: costPhysicalItem }
    ];

    const nextStep = () => {
        const steps = ["CONFIRMED", "IN_PREPARATION", "SEND", "RECEIVED", "CLOSED"];
        const nextState = steps.indexOf(order.state) === steps.length - 1 ? order.state : steps[steps.indexOf(order.state) + 1];
        console.log(nextState)
        fetch(`http://localhost:3001/orders/${order.id}/advance-state`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nextState })
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to advance order state', error);
                    setError('Failed to advance order state');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No data found');
                    return;
                }

                data.state = data.newState
                data.lastUpdateDateTime = new Date().toISOString();
            });
    }

    return (
        <div className="admin-order" ref={ref}>
            <CartProvider>
                <Header hide={false} />
            </CartProvider>
            <label style={{ fontSize: '3em', color: '#fff', fontWeight: 'bold' }} className="title">Order</label>
            <div className="order-header">
                <label className="admin-order-id">Order ID: #{order.id}</label>
                <label className="admin-order-date">Créée le : {formatDate(order.creationDateTime)}</label>
            </div>
            <div className="order-items">
                <div className="order-reports">
                    <label className="title" style={{ fontSize: '1.5em' }}>Rapport de commande</label>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx={"50%"}
                                cy={"50%"}
                                innerRadius={"60%"}
                                outerRadius={"80%"}
                                fill="#8884d8"
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        // Draw the total cost in the center of the pie chart
                            <text x={"50%"} y={"50%"} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '2.5em', fontWeight: 'bold' }}>
                                {totalCost}€
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="order-payement-method">
                        <label className="info">Payé par: {order.paymentMode}</label>
                    </div>
                </div>
                <div className="order-status">
                    <label className="title" style={{ fontSize: '1.5em' }}>Statut de la commande</label>
                    <OrderTimeline order={order} />
                    <button className="btn-next-step" onClick={nextStep}>Passer à l'étape suivante</button>
                </div>
            </div>
            <div className="order-infos">
                <div className="order-info-card">
                    <label className="title" style={{ fontSize: '1.5em' }}>Information de livraison</label>
                    <div className="delivery-info-first-line">
                        <label className="delivery-info">Méthode de livraison: <b>{delivery.name}</b></label>
                        <label className="delivery-info">Prix de la livraison: <b>{delivery.cost}€</b></label>
                    </div>
                    <div className="delivery-info-second-line">
                        <div className="delivery-info-second-line-right">
                            <label className="delivery-info">{order.name}</label>
                            <label className="delivery-info">{order.address}</label>
                        </div>
                        <div className="delivery-info-second-line-left">
                            <label className="delivery-info">{order.zipcode}</label>
                            <label className="delivery-info">{order.country}</label>
                        </div>
                    </div>
                </div>
                <div className="order-info-card">
                    <label className="title" style={{ fontSize: '1.5em' }}>Information de l'utilisateur</label>
                    <div className="user-info-content">
                        <div className="user-info-right">
                            <img className="user-avatar" src={user.image} alt="user-avatar" />
                        </div>
                        <div className="user-info-left">
                            <label className="user-info-id">ID #{user.id}</label>
                            <label className="user-info-pseudo">{user.pseudo}</label>
                            <label className="user-info-email">{user.email}</label>
                            <label className="user-date">Créé le : {formatDate(user.registrationDateTime)}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="order-items-list">
                <label className="title" style={{ fontSize: '1.5em' }}>Liste des items</label>
                <div className="items-list">
                    {digitalItems.map((item) => (
                        <div className="item-card" key={item.id}>
                            <img className="item-image" src={item.image.path} alt="item" />
                            <label className="item-name">{item.name}</label>
                            <label className="item-price">{item.price}€</label>
                            <label className="item-quantity">Quantité: {item.quantity}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminOrder;