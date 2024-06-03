import GameCard from "./GameCard";

import React, { useEffect, useState } from 'react';
import './AllGames.css';

function AllGames() {
    const [games, setGames] = useState([]);
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/games')
            .then(response => response.json())
            .then(data => {
                setGames(data);
            })
            .catch(error => console.error('Erreur lors de la récupération des jeux :', error));
        
        fetch('http://localhost:3001/orders/items')
            .then(response => response.json())
            .then(data => {
                setOrderItems(data);
            })
            .catch(error => console.error('Erreur lors de la récupération des items de commande :', error));
    }, []);

    useEffect(() => {
        if (orderItems.length > 0) {
            games.forEach(game => {
                let totalOrdered = 0;
                orderItems.forEach(item => {
                    if (game.id === item.item_id) {
                        totalOrdered += item.quantity;
                    }
                });
                game.totalOrdered = totalOrdered;
            });

            let sortedGames = games.sort((a, b) => b.totalOrdered - a.totalOrdered);
            // Limit to 10 games
            setGames(sortedGames.slice(0, 10));
            console.log('Games:', games);
        }
    }, [orderItems, games]);
    
    if (games === undefined || games.length === 0) {
        return (<div>Chargement...</div>);
    }

    return (
        <div className="AllGames">
            <label className="AllGames_title">Nous jeux</label>
            <div className="AllGames_container">
                {games.map((game, index) => (
                    <GameCard c_game={game} key={index} />
                ))}
            </div>
        </div>
    );
}

export default AllGames;