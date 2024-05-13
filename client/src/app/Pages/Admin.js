import { useEffect, useState } from 'react';
import Header from '../components/Header';
import DailyReport from '../components/admin/DailyReport';

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

return (
    <div className="admin">
        <Header hide={false} />
        <div className="dashboard">
            <DailyReport orders={orders} />
        </div>
    </div>
);
}

export default Admin;