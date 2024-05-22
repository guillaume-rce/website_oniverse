import { useEffect, useState } from 'react';
import Header from '../components/Header';
import DailyReport from '../components/admin/DailyReport';
import LastOrders from '../components/admin/LastOrders';
import Games from '../components/admin/Games';
import DeliveryMethods from '../components/admin/DeliveryMethods';
import Info from '../components/admin/Info';
import Users from '../components/admin/Users';

import './Admin.css';

const Admin = () => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');

    const [user, setUser] = useState();
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/user/${userId}`)
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
    }, []);

    const [orders, setOrders] = useState([]);
    const [lastOrders, setLastOrders] = useState([]);
    const [games, setGames] = useState([]);
    const [users, setUsers] = useState([]);
    const [delivery, setDelivery] = useState([]);

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

        fetch('http://localhost:3001/orders?limit=5&sortOrder=desc')
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch last orders', error);
                    setError('Failed to fetch last orders');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No last orders found');
                    return;
                }

                setLastOrders(data);
            });

        fetch('http://localhost:3001/games')
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch games', error);
                    setError('Failed to fetch games');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No games found');
                    return;
                }

                setGames(data);
            });

        fetch('http://localhost:3001/user')
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch users', error);
                    setError('Failed to fetch users');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No users found');
                    return;
                }

                setUsers(data);
            });

        fetch('http://localhost:3001/delivery')
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
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (user.role !== 1) {
        window.location.href = '/';
    }

    if (orders.length === 0 || games.length === 0 || users.length === 0 || delivery.length === 0) {
        return <div>Loading...</div>;
    }

    let totalBenefit = 0;
    orders.forEach((order) => {
        totalBenefit += order.total;
    });
    
    const totalSell = orders.length;
    const totalUsers = users.length;

    return (
        <div className="admin">
            <Header hide={false} />
            <div className="dashboard">
                <div className="welcome">
                    <label style={{ fontSize: '3em', color: '#fff', fontWeight: 'bold' }}>Welcome back to your dashboard, {user.pseudo}!</label>
                </div>
                <div style={{ height: '400px', width: '100%' }}>
                    <DailyReport orders={orders} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', height: '400px', width: '100%' }}>
                    <div style={{ width: '33%' }}>
                        <LastOrders orders={lastOrders} className="last-orders" />
                    </div>
                    <div style={{ width: '66%' }}>
                        <Games games={games} className="games" />
                    </div>
                </div>
                <div style={{ height: '160px', width: '100%' }}>
                    <DeliveryMethods deliveryMethods={delivery} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', height: '200px', width: '100%' }}>
                    <Info title="Total orders" num={totalSell} type="orders" icon="https://img.icons8.com/ios/452/shopping-cart.png" />
                    <Info title="Total benefit" num={totalBenefit} type="€" icon="https://img.icons8.com/ios/452/money.png" />
                    <Info title="Total users" num={totalUsers} type="users" icon="https://img.icons8.com/ios/452/user.png" />
                </div>
                <div style={{ height: '400px', width: '100%' }}>
                    <Users users={users} />
                </div>
            </div>
        </div>
    );
}

export default Admin;