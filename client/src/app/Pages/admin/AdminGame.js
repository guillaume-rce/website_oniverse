import "./AdminGame.css";
import { CartProvider } from "../../CartContext";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import Header from "../../components/Header";
import CustomMultiselect from "../../components/CustomMultiselect";
import GameImageEdit from "../../components/admin/GameImageEdit";

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
    const [showModal, setShowModal] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [inputValue, setInputValue] = useState('');

    const [allTags, setAllTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    // ---- For editing zone
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [url, setUrl] = useState('');

    // ---- For tags zone

    const handleAddTagClick = (event) => {
        setAddingTags(!addingTags);
        if (!addingTags) {
            setMousePosition({
                x: event.clientX,
                y: 800
            });
            setShowModal(true);
        }
    };

    useEffect(() => {
        if (!addingTags) {
            setTimeout(() => setShowModal(false), 300);
        }
    }, [addingTags]);

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

                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setStock(data.stock);
                setUrl(data.url);
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

    const filteredItems = items.filter((item) => item.isDigital && item.item_id === game.id);

    const orderIds = filteredItems.map(item => item.order_id);
    const relevantOrders = orders.filter(order => orderIds.includes(order.id));
    const orderDates = relevantOrders.map(order => new Date(order.creationDateTime));

    const minDate = new Date(Math.min(...orderDates));
    minDate.setHours(0, 0, 0, 0);
    const maxDate = new Date(Math.max(...orderDates));
    maxDate.setHours(23, 59, 59, 999);

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    var data = [];
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
        data.push({ name: formatDate(new Date(d)), Total: 0 });
    }

    filteredItems.forEach((item) => {
        const order = relevantOrders.find((order) => order.id === item.order_id);
        const date = new Date(order.creationDateTime);
        date.setHours(0, 0, 0, 0);
        const key = formatDate(date);
        const existing = data.find((d) => d.name === key);
        if (!existing) {
            console.error(`No data entry found for date ${key}`);
            return;
        }
        const total = item.quantity * game.price;
        existing.Total = parseFloat((existing.Total + total).toFixed(2));
    });



    let tagsOptions = [];
    allTags.forEach((tag) => {
        if (!game.tags.some((t) => t.id === tag.id)) {
            tagsOptions.push({ name: tag.name, value: tag.name, id: tag.id });
        }
    });

    // Ajouter les tags sélectionnés à la liste des tags du jeu
    const handeleSubmit = () => {
        if (selectedTags.length > 0) {
            // tags = [ "tag1", "tag2", "tag3" ]
            const tags = selectedTags.map((tag) => tag.name);
            if (tags.length > 0) {
                fetch(`http://localhost:3001/games/${game.id}/tags`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tags
                    }),
                })
                    .then(
                        (response) => response.json(),
                        (error) => {
                            console.error("Failed to add tags", error);
                            setError("Failed to add tags");
                        }
                    )
                    .then((data) => {
                        if (!data) {
                            console.error("No tags added");
                            return;
                        }

                        // ajouter les "tags" à la liste des tags du jeu
                        console.log(data);
                        setGame({ ...game, tags: [...game.tags, ...data.tags] });

                    });
            }
        }
    }

    const handleDeleteTagClick = (tagId) => {
        fetch(`http://localhost:3001/tags/${tagId}`, {
            method: "DELETE",
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error("Failed to delete tag", error);
                    setError("Failed to delete tag");
                }
            )
            .then((data) => {
                if (!data) {
                    console.error("No tag deleted");
                    return;
                }

                // supprimer le tag de la liste des tags du jeu
                setGame({
                    ...game,
                    tags: game.tags.filter((tag) => tag.id !== tagId),
                });
            });
    }

    return (
        <div className="admin-game" ref={ref}>
            <CartProvider>
                <Header hide={false} />
            </CartProvider>
            <label style={{ fontSize: '3em', color: '#fff', fontWeight: 'bold' }}
                className="title">Détails du jeu</label>
            <div className="admin-game-content">
                <div className="admin-game-info">
                    <div className="admin-game-present">
                        <img src={game.logo ? game.logo.path : game.image.path} alt={game.name} className="admin-game-image" />
                        <div className="admin-game-description">
                            <label className="admin-game-name">{game.name}</label>
                            <label className="admin-game-description">{game.description}</label>
                            <label className="admin-game-price">{game.price} €</label>
                            <label className="admin-game-stock">Stock : {game.stock}</label>
                        </div>
                        <div className="admin-game-actions">
                            <div className="admin-game-action" style={{ padding: '10px' }} onClick={() => setEditing(!editing)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000" class="w-6 h-6">
                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                </svg>
                            </div>
                            <div className="admin-game-action" style={{ padding: '5px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000" class="w-6 h-6">
                                    <path d="M19 6H15V4H9V6H5V8H19V6ZM17 10H7L8 18H16L17 10Z" />
                                </svg>
                            </div>
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
                                    <div className="admin-game-tag-delete" onClick={() => handleDeleteTagClick(tag.id)}>
                                        <svg className="delete-tag-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" fill="#f00">
                                            <path d="M19 6H15V4H9V6H5V8H19V6ZM17 10H7L8 18H16L17 10Z" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="add-tag" onClick={handleAddTagClick}>
                            <svg className={`add-tag-icon ${addingTags ? "cross" : ""}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" fill="#fff">
                                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                            </svg>
                        </button>
                    </div>
                    {showModal && (
                        <div className={`modal ${addingTags ? 'fade-in' : 'fade-out'}`} style={{ top: `${mousePosition.y + 250}px`, left: `${mousePosition.x}px` }}>
                            <label className="modal-title">Ajouter un tag</label>
                            <div className="modal-input">
                                <CustomMultiselect
                                    tagsOptions={allTags.map(tag => ({ name: tag.name, value: tag.name, id: tag.id }))}
                                    selectedTags={selectedTags}
                                    setSelectedTags={setSelectedTags}
                                    setAllTags={setAllTags}
                                    allTags={allTags}
                                />
                                <button className="modal-button-submit" onClick={() => handeleSubmit()}>Ajouter</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            { editing && (
            <div className="admin-game-edit">
                <div className="admin-game-edit-container">
                    <label className="title" style={{ fontSize: '2em' }}>Modifier le jeu</label>
                    <div className="admin-game-edit-content">
                        <div className="admin-game-edit-input-body">
                            <div className="admin-game-edit-input-container">
                                <label className="admin-game-edit-label">Nom</label>
                                <div className="admin-game-edit-input-separator"></div>
                                <input type="text" className="admin-game-edit-input" value={name}
                                    onChange={(event) => setName(event.target.value)} />
                            </div>
                            <div className="admin-game-edit-input-container">
                                <label className="admin-game-edit-label">Description</label>
                                <div className="admin-game-edit-input-separator"></div>
                                <textarea className="admin-game-edit-input desc" value={description}
                                    onChange={(event) => setDescription(event.target.value)} />
                            </div>
                            <div className="admin-game-edit-input-container">
                                <label className="admin-game-edit-label">Prix</label>
                                <div className="admin-game-edit-input-separator"></div>
                                <input type="number" className="admin-game-edit-input" value={price}
                                    onChange={(event) => setPrice(event.target.value)} />
                            </div>
                            <div className="admin-game-edit-input-container">
                                <label className="admin-game-edit-label">Stock</label>
                                <div className="admin-game-edit-input-separator"></div>
                                <input type="number" className="admin-game-edit-input" value={stock}
                                    onChange={(event) => setStock(event.target.value)} />
                            </div>
                            <div className="admin-game-edit-input-container">
                                <label className="admin-game-edit-label">URL du jeu</label>
                                <div className="admin-game-edit-input-separator"></div>
                                <input type="text" className="admin-game-edit-input" value={url}
                                    onChange={(event) => setUrl(event.target.value)} />
                            </div>
                        </div>
                        <div className="admin-game-edit-images-container">
                            <label className="admin-game-edit-label">Image</label>
                            <div className="admin-game-edit-image-container">
                                <GameImageEdit gameImage={game.image ? game.image.path : null} onFileReady={(file) => console.log(file)} />
                            </div>
                            <div className="admin-game-edit-image-separator"></div>
                            <label className="admin-game-edit-label">Logo</label>
                            <div className="admin-game-edit-image-container">
                                <GameImageEdit gameImage={game.logo ? game.logo.path : null} onFileReady={(file) => console.log(file)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default AdminGame;
