import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

import './AdminOrder.css';
import { CartProvider } from '../../CartContext';
import Header from '../../components/Header';

import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, Tooltip} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminOrder = () => {
    var { id } = useParams();
    const [order, setOrder] = useState(null);
    const [delivery, setDelivery] = useState(null);
    const [items, setItems] = useState(null);
    const [digitalItems, setDigitalItems] = useState([]);
    const [costDigitalItem, setCostDigitalItem] = useState(0);
    const [costPhysicalItem, setCostPhysicalItem] = useState(0);
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
            totalCost += digitalItem.price;
        });
        setCostDigitalItem(totalCost);
    }, [digitalItems]);

    if (!order || !delivery || !items) {
        return <div>Loading...</div>;
    }

    const formatDate = (date) => {
        const dateObj = new Date(date);
        return `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
    }

    const data = [
        { name: 'Livraison', value: delivery.cost },
        { name: 'Item digital', value: costDigitalItem },
        { name: 'Item physique', value: costPhysicalItem }
    ];

    return (
        <div className="admin-order">
            <CartProvider>
                <Header hide={false} />
            </CartProvider>
            <label style={{ fontSize: '3em', color: '#fff', fontWeight: 'bold' }} className="title">Order</label>
            <div className="order-info">
                <label className="admin-order-id">Order ID: #{order.id}</label>
                <label className="admin-order-date">{formatDate(order.creationDateTime)}</label>
                <label className="admin-order-delivery">Delivery: {delivery?.name}</label>
                <label className="admin-order-payment">Payment: {order.paymentMode}</label>
            </div>
            <div className="order-reports">
                <PieChart width={800} height={400}>
                    <Pie
                        data={data}
                        cx={120}
                        cy={200}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>
        </div>
    );
}

export default AdminOrder;