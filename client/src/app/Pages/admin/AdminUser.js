import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import defaultAvatar from '../../../res/default/profile.jpg';
import './AdminUser.css';
import UserAnalyse from "../../components/admin/UserAnalyse";

const AdminUser = () => {
    var { id } = useParams();
    const [user, setUser] = useState({});
    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);
    const [games, setGames] = useState([]);

    const ref = useRef(null);
    const [isAnimated, setIsAnimated] = useState(false);

    const [total, setTotal] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/user/${id}`)
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

    useEffect(() => {
        fetch(`http://localhost:3001/orders/user/${id}`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch orders', error);
                    setError('Failed to fetch orders');
                }
            )
            .then((data) => {
                if (!data || (data.error && data.error !== 'No orders found for this user.')) {
                    console.error('No orders found');
                    return;
                }

                if (data.error === 'No orders found for this user.' || data.length === 0) {
                    setOrders([]);
                    console.log('No orders found');
                    return;
                }

                setOrders(data);

                let totalV = 0;
                data.forEach((order) => {
                    totalV += order.total;
                });

                setTotal(totalV);

                let totalOrdersV = data.length;
                setTotalOrders(totalOrdersV);
            });

        fetch(`http://localhost:3001/orders/items/user/${id}`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch items', error);
                    setError('Failed to fetch items');
                }
            )
            .then((data) => {
                if (!data || (data.error && data.error !== 'No items found for this user.' &&
                    data.error !== 'No orders found for this user.')) {
                    console.error('No items found');
                    return;
                }

                if (data.error === 'No items found for this user.' || data.error === 'No orders found for this user.' ||
                    data.length === 0) {
                    setItems([]);
                    console.log('No items found');
                    return;
                }

                setItems(data);

                let totalItemsV = 0;
                data.forEach((item) => {
                    totalItemsV += item.quantity;
                });

                setTotalItems(totalItemsV);
            });

        fetch(`http://localhost:3001/user/${id}/games`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch games', error);
                    setError('Failed to fetch games');
                }
            )
            .then((data) => {
                if (!data || (data.error && data.error !== 'No games found for this user.')) {
                    console.error('No games found');
                    return;
                }

                if (data.error === 'No games found for this user.' || data.length === 0) {
                    setGames([]);
                    console.log('No games found');
                    return;
                }

                setGames(data);
            });
    }, [id]);

    const animateValue = (start, end, duration, setter) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setter(Math.floor(progress * (end - start) + start));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    }

    const changeRole = () => {
        fetch(`http://localhost:3001/user/${id}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: user.role === 0 ? 1 : 0
            })
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to change role', error);
                    setError('Failed to change role');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No data found');
                    return;
                }

                let newUser = user;
                newUser.role = user.role === 0 ? 1 : 0;
                setUser(newUser);
                window.location.reload();
            });
    }

    const deleteAccount = () => {
        fetch(`http://localhost:3001/user/${id}`, {
            method: 'DELETE'
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to delete user', error);
                    setError('Failed to delete user');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No data found');
                    return;
                }

                window.location.href = '/admin';
            });
    }

    return (
        <div className="admin-user" ref={ref}>
            <Header hide={false} />
            <label style={{ fontSize: '3em', color: '#fff', fontWeight: 'bold' }}
                className="title">Utilisateur</label>
            <div className="admin-user-firstline">
                <div className="admin-user-info">
                    <img src={user.image || defaultAvatar} alt="user" className="admin-user-avatar" />
                    <div className="admin-user-info-content">
                        <div className="admin-user-id-delete">
                            <label className="admin-user-id">ID: #{user.id}</label>
                            <button className="admin-user-delete"
                                onMouseOver={() => document.getElementById('delete-user-icon').style.fill = '#fff'}
                                onMouseOut={() => document.getElementById('delete-user-icon').style.fill = '#e69005'}
                                onClick={deleteAccount}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e69005" class="w-6 h-6" className="admin-user-delete-icon"
                                    id="delete-user-icon">
                                    <path d="M19 6H15V4H9V6H5V8H19V6ZM17 10H7L8 18H16L17 10Z" />
                                </svg>
                            </button>
                        </div>
                        <label className="admin-user-name">{user.pseudo}</label>
                        <label className="admin-user-email">{user.email}</label>
                        <label className="admin-user-creation">Date de création: {formatDate(user.registrationDateTime)}</label>
                        <div className="admin-user-role-container">
                            <label className="admin-user-role">Rôle: <b>{user.role === 0 ? 'Utilisateur' : 'Administrateur'}</b></label>
                            <button className="admin-user-role-button" onClick={changeRole}>
                                {user.role === 0 ? 'Promouvoir' : 'Rétrograder'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="admin-user-total">
                    <div className="admin-user-total-info">
                        <label className="admin-user-total-label">Total des commandes</label>
                        <label className="admin-user-total-value">{total}€</label>
                    </div>
                    <div className="admin-user-total-info">
                        <label className="admin-user-total-label">Nombre de commandes</label>
                        <label className="admin-user-total-value">{totalOrders}</label>
                    </div>
                    <div className="admin-user-total-info">
                        <label className="admin-user-total-label">Nombre d'articles</label>
                        <label className="admin-user-total-value">{totalItems}</label>
                    </div>
                </div>
            </div>
            <div className="admin-user-orders">
                <label className="title">Commandes</label>
                <div className="admin-user-orders-content">
                    {orders.length === 0 ? <label>Aucune commande trouvée</label> :
                        orders.map((order) => (
                            <div key={order.id} className="admin-user-order" onClick={() => window.location.href = `/admin/orders/${order.id}`}>
                                <label className="admin-user-order-id">ID: #{order.id}</label>
                                <label className="admin-user-order-date">Date: {formatDate(order.creationDateTime)}</label>
                                <label className="admin-user-order-total">Total: {order.total}€</label>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="admin-user-analyse">
                <label className="title">Analyse des commandes</label>
                <UserAnalyse userId={id} />
            </div>
            <div className="admin-user-games">
                <label className="title">Jeux</label>
                <div className="admin-user-games-content">
                    {games.length === 0 ? <label className="admin-user-no-games">Aucun jeu trouvé</label> :
                        games.map((game) => (
                            <div key={game.id} className="admin-user-game" onClick={() => window.location.href = `/admin/games/${game.id}`}>
                                <label className="admin-user-game-id">#{game.id}</label>
                                <img src={game.logo ? game.logo.path : game.image.path} alt="game" className="admin-user-game-image" />
                                <label className="admin-user-game-name">{game.name}</label>
                                <label className="admin-user-game-price">{game.price}€</label>
                            </div>
                        ))}
                </div>
            </div>
        </div >
    );
}

export default AdminUser;