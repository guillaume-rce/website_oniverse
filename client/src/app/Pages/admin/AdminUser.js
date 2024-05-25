import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import defaultAvatar from '../../../res/default/profile.jpg';
import './AdminUser.css';

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

    if (orders && orders.length > 0) {
        orders.forEach((order) => {
            fetch(`http://localhost:3001/orders/items/${order.id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error && data.error !== 'No items found for this order.') {
                        console.error('Failed to fetch items for order', order.id, data.error);
                        setError('Failed to fetch items for order');
                        return;
                    }
                    if (data.error === 'No items found for this order.' || !data) {
                        console.log('No items found for order', order.id);
                        return;
                    }

                    if (Array.isArray(data) && data.length > 0) {
                        setItems(items.concat(data));
                    } else {
                        console.error('Expected an array, but received:', data);
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch items for order', order.id, error);
                    setError('Failed to fetch items for order');
                });
        });
    }

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

    useEffect(() => {
        if (items.length === 0) {
            return;
        }

        let total = 0;
        let totalOrders = 0;
        let totalItems = 0;

        totalOrders = orders.length;
        orders.forEach((order) => {
            total += order.total;
        });

        items.forEach((item) => {
            totalItems += item.quantity;
        });

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isAnimated) {
                    animateValue(0, total, 2000, setTotal);
                    animateValue(0, totalOrders, 2000, setTotalOrders);
                    animateValue(0, totalItems, 2000, setTotalItems);
                    
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
    }, [items, orders, isAnimated]);

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

    return (
        <div className="admin-user" ref={ref}>
            <Header hide={false} />
            <label style={{ fontSize: '3em', color: '#fff', fontWeight: 'bold' }}
                className="title">Utilisateur</label>
            <div className="admin-user-firstline">
                <div className="admin-user-info">
                    <img src={user.image || defaultAvatar} alt="user" className="admin-user-avatar" />
                    <div className="admin-user-info-content">
                        <label className="admin-user-id">ID: #{user.id}</label>
                        <label className="admin-user-name">{user.pseudo}</label>
                        <label className="admin-user-email">{user.email}</label>
                        <label className="admin-user-creation">Date de création: {formatDate(user.registrationDateTime)}</label>
                        <label className="admin-user-role">Rôle: <b>{user.role === 0 ? 'Utilisateur' : 'Administrateur'}</b></label>
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
                    {orders.map((order) => (
                        <div key={order.id} className="admin-user-order">
                            <label className="admin-user-order-id">ID: #{order.id}</label>
                            <label className="admin-user-order-date">Date: {formatDate(order.creationDateTime)}</label>
                            <label className="admin-user-order-total">Total: {order.total}€</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="admin-user-games">
                <label className="admin-user-games-label">Jeux</label>
                <div className="admin-user-games-content">
                    {games.map((game) => (
                        <div key={game.id} className="admin-user-game">
                            <img src={game.logo ? game.logo.path : game.image.path} alt="game" className="admin-user-game-image" />
                            <label className="admin-user-game-id">ID: #{game.id}</label>
                            <label className="admin-user-game-name">{game.name}</label>
                            <label className="admin-user-game-price">{game.price}€</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminUser;