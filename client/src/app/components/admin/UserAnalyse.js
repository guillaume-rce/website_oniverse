import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserAnalyse = ({ userId }) => {
    const [items, setItems] = useState([]);
    const [games, setGames] = useState([]);

    const [error, setError] = useState('');

    useEffect(() => {
        ///orders/items/user/{userId}
        fetch(`http://localhost:3001/orders/items/user/${userId}`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch user items', error);
                    setError('Failed to fetch user items');
                }
            )
            .then(data => {
                if (!data || data.length === 0 || data.error) {
                    console.log('Aucun item trouvé pour l\'utilisateur');
                    return;
                }

                setItems(data);
            });

        fetch(`http://localhost:3001/user/${userId}/games`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch user games', error);
                    setError('Failed to fetch user games');
                }
            )
            .then(data => {
                if (!data || data.length === 0 || data.error) {
                    console.log('Aucun jeu trouvé pour l\'utilisateur');
                    return;
                }

                setGames(data);
            });

    }, [userId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!games || !items) {
        return <div>Cette utilisateur n'a pas encore acheté de jeux</div>;
    }

    let data = [];
    games.forEach(game => {
        let gameData = {
            name: game.name,
            total: 0,
            sales: 0
        };

        items.forEach(item => {
            if (item.item_id === game.id) {
                gameData.sales++;
                gameData.total += game.price * item.quantity;
            }
        });

        data.push(gameData);
    });

    return (
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" activeBar={<Rectangle fill="#d2b4de " stroke="#8e44ad" />} />
          <Bar dataKey="total" fill="#82ca9d" activeBar={<Rectangle fill="#a9dfbf" stroke="#27ae60" />} />
        </BarChart>
      </ResponsiveContainer>
    );
}

export default UserAnalyse;