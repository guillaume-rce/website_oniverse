import "./AdminGame.css";
import { CartProvider } from "../../CartContext";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Multiselect from "multiselect-react-dropdown";

import Header from "../../components/Header";

const AdminGame = () => {
    var { id } = useParams();
    const [game, setGame] = useState(null);
    const [items, setItems] = useState(null);
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState(null);

    const ref = useRef();
    const [isAnimated, setIsAnimated] = useState(false);
    const [totalSalesValue, setTotalSalesValue] = useState(0);
    const [totalRevenueValue, setTotalRevenueValue] = useState(0);

    const [addingTags, setAddingTags] = useState(false);

    const [allTags, setAllTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/games/${id}`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error("Failed to fetch game", error);
                    setError("Failed to fetch game");
                }
            )
            .then((data) => {
                if (!data) {
                    console.error("No game found");
                    return;
                }

                setGame(data);
            });

        fetch("http://localhost:3001/orders/items")
            .then(
                (response) => response.json(),
                (error) => {
                    console.error("Failed to fetch items", error);
                    setError("Failed to fetch items");
                }
            )
            .then((data) => {
                if (!data) {
                    console.error("No items found");
                    return;
                }

                setItems(data);
            });

        fetch("http://localhost:3001/orders")
            .then(
                (response) => response.json(),
                (error) => {
                    console.error("Failed to fetch orders", error);
                    setError("Failed to fetch orders");
                }
            )
            .then((data) => {
                if (!data) {
                    console.error("No orders found");
                    return;
                }

                setOrders(data);
            });

        fetch("http://localhost:3001/tags")
            .then(
                (response) => response.json(),
                (error) => {
                    console.error("Failed to fetch tags", error);
                    setError("Failed to fetch tags");
                }
            )
            .then((data) => {
                if (!data) {
                    console.error("No tags found");
                    return;
                }

                setAllTags(data.map((tag) => ({ name: tag.name, id: tag.id })));
            });
    }, [id]);

    useEffect(() => {
        if (!game || !items || !orders) {
            return;
        }

        const totalSales = items.reduce((acc, item) => {
            if (item.isDigital && item.item_id === game.id) {
                return acc + item.quantity;
            }
            return acc;
        }, 0);

        const totalRevenue = items.reduce((acc, item) => {
            if (item.isDigital && item.item_id === game.id) {
                return acc + item.quantity * game.price;
            }
            return acc;
        }, 0);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isAnimated) {
                    animateValue(0, totalSales, 1000, setTotalSalesValue);
                    animateValue(0, totalRevenue, 1000, setTotalRevenueValue);
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
    }, [game, items, orders, isAnimated]);

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

    if (!game || !items || !orders) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    var data = [];
    items.forEach((item) => {
        if (item.isDigital && item.item_id === game.id) {
            const order = orders.find((order) => order.id === item.order_id);
            const date = new Date(order.creationDateTime);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const key = `${day}/${month}/${year}`;
            const existing = data.find((d) => d.name === key);
            const total = item.quantity * game.price;
            if (existing) {
                existing.Total = parseFloat(
                    (existing.Total + total).toFixed(2));
            } else {
                data.push({ name: key, Total: parseFloat(total.toFixed(2)) });
            }
        }
    });

    const handleAddTagClick = () => {
        setAddingTags(!addingTags);

        if (addingTags) {
            setSelectedTags([]);
        }
    }

    const tagsOptions = allTags.map((tag) => ({ name: tag.name, value: tag.name, id: tag.id }));

    return (
        <div className="admin-game" ref={ref}>
            <CartProvider>
                <Header hide={false} />
            </CartProvider>
            <label style={{ fontSize: '3em', color: '#fff', fontWeight: 'bold' }}
                className="title">Détails du jeu {game.name}</label>
            <div className="admin-game-content">
                <div className="admin-game-info">
                    <div className="admin-game-present">
                        <img src={game.image.path} alt={game.name} className="admin-game-image" />
                        <div className="admin-game-description">
                            <label className="admin-game-name">{game.name}</label>
                            <label className="admin-game-description">{game.description}</label>
                            <label className="admin-game-price">{game.price} €</label>
                            <label className="admin-game-stock">Stock : {game.stock}</label>
                        </div>
                    </div>
                    <div className="admin-game-selling">
                        <label className="title" style={{ fontSize: '2em' }}>Ventes</label>
                        <label className="admin-game-sell">
                            Nombre de ventes :</label>
                        <div className="admin-game-sell-value">{totalSalesValue}</div>
                        <label className="admin-game-sell">
                            Total de revenue :</label>
                        <div className="admin-game-sell-value">{totalRevenueValue} €</div>
                    </div>
                </div>
                <div className="admin-game-reports">
                    <label className="title" style={{ fontSize: '2em' }}>Rapport de ventes</label>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                            className='line-chart' id='line-chart'>
                            <Line type="monotone" dataKey="Total" stroke="#82ca9d" />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="admin-game-reviews">
                    <label className="title" style={{ fontSize: '2em' }}>Avis</label>
                    <div className="admin-game-reviews-list">
                        <label>Encore en développement... 🙃</label>
                    </div>
                </div>

                <div className="admin-game-tags">
                    <label className="title" style={{ fontSize: '2em' }}>Tags</label>
                    <div className="admin-game-tags-container">
                        <div className="admin-game-tags-list">
                            {game.tags.map((tag) => (
                                <div key={tag.id} className="admin-game-tag">
                                    <label className="admin-game-tag-label">{tag.name}</label>
                                </div>
                            ))}
                        </div>
                        <button className="add-tag" onClick={handleAddTagClick}>
                            <svg className={`add-tag-icon ${addingTags ? "cross" : ""}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" fill="#fff">
                                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                            </svg>
                        </button>
                    </div>
                    {addingTags && (
                        <div className={`modal ${addingTags ? 'fade-in' : 'fade-out'}`}>
                            <Multiselect
                                options={tagsOptions}
                                selectedValues={selectedTags}
                                displayValue="name"
                                id="tags-select"
                                className="tags-select"
                                placeholder="Sélectionner un tag"
                                onSelect={(selectedList, selectedItem) => { setSelectedTags(selectedList) }}
                                onRemove={(selectedList, removedItem) => { setSelectedTags(selectedList) }}
                                style={
                                    {
                                        chips: {
                                            background: '#3f51b5'
                                        },
                                        multiselectContainer: {
                                            color: '#3f51b5',
                                        },
                                    }
                                }
                            />
                        </div>
                    )}
                </div>

                <div className="admin-game-actions">
                    <label className="title" style={{ fontSize: '2em' }}>Actions</label>
                    <div className="admin-game-actions-list">
                        <button className="admin-game-action">Modifier</button>
                        <button className="admin-game-action">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGame;
