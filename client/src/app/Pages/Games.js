import { useCart } from "../CartContext";
import Header from "../components/Header";
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";

import './Games.css';
import Game from "../components/games/Game";

const Games = () => {
    const { addToCart } = useCart();
    const [games, setGames] = useState([]);
    const [gamesFiltered, setGamesFiltered] = useState([]);
    const [tags, setTags] = useState([]);
    const [error, setError] = useState(null);

    const [sort, setSort] = useState('asc');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const gamesPerPage = 5;

    useEffect(() => {
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
                setGamesFiltered(data);
            });

        fetch('http://localhost:3001/tags')
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch tags', error);
                    setError('Failed to fetch tags');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No tags found');
                    return;
                }

                setTags(data);
            });
    }, []);

    useEffect(() => {
        const minPrice = Math.min(...games.map(game => game.price));
        const maxPrice = Math.max(...games.map(game => game.price));
        const documentMinPrice = document.getElementById('min-price');
        const documentMaxPrice = document.getElementById('max-price');
        if (documentMinPrice) {
            documentMinPrice.value = minPrice;
        }
        if (documentMaxPrice) {
            documentMaxPrice.value = maxPrice;
        }
    }, [games]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (games.length === 0) {
        return <div>Loading...</div>;
    }

    const tagsFilterGames = (selectedTags) => {
        if (selectedTags.length === 0) {
            setGamesFiltered(games);
            return;
        }

        const filteredGames = games.filter((game) => {
            const gameTags = game.tags.map((tag) => tag.id);
            return selectedTags.every((tag) => gameTags.includes(tag.id));
        });

        setGamesFiltered(filteredGames);
        setCurrentPage(1); // Reset to first page when filters are applied
    };

    const priceFilterGames = (minPrice, maxPrice) => {
        if (minPrice === '' && maxPrice === '') {
            setGamesFiltered(games);
            return;
        }

        if (minPrice === '') {
            minPrice = 0;
        }

        if (maxPrice === '') {
            maxPrice = Number.MAX_SAFE_INTEGER;
        }

        const filteredGames = games.filter((game) => game.price >= minPrice && game.price <= maxPrice);

        setGamesFiltered(filteredGames);
        setCurrentPage(1); // Reset to first page when filters are applied
    };

    const sortGames = () => {
        setSort(sort === 'asc' ? 'desc' : 'asc');

        const sortedGames = gamesFiltered.sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price);
        setGamesFiltered(sortedGames);
    };

    // Calculate current games to display
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = gamesFiltered.slice(indexOfFirstGame, indexOfLastGame);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ width: '100%', minHeight: '100%' }}>
            <Header hide={false} />
            <div className='games-page'>
                <label className='title'>Nos jeux</label>
                <div className='filter-container'>
                    <Multiselect
                        options={tags}
                        displayValue='name'
                        onSelect={(selectedList) => tagsFilterGames(selectedList)}
                        onRemove={(selectedList) => tagsFilterGames(selectedList)}
                        placeholder='Filtrer par tags'
                        closeIcon='cancel'
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
                    <div className='price-filter'>
                        <label className='price-label'>Filtrer par prix</label>
                        <input type='number' placeholder='Min' className='price-input' id='min-price' step='0.1'
                            onChange={(event) => priceFilterGames(event.target.value, document.getElementById('max-price').value)} />
                        <input type='number' placeholder='Max' className='price-input' id='max-price' step='0.1'
                            onChange={(event) => priceFilterGames(document.getElementById('min-price').value, event.target.value)} />

                        <button className='sort-button' onClick={sortGames}>
                            {sort === 'desc' ?
                                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.00002 5C7.00002 4.44772 6.5523 4 6.00002 4C5.44773 4 5.00002 4.44772 5.00002 5V16.5858L3.7071 15.2929C3.31658 14.9024 2.68341 14.9024 2.29289 15.2929C1.90237 15.6834 1.90237 16.3166 2.2929 16.7071L5.29291 19.7071C5.68344 20.0976 6.3166 20.0976 6.70713 19.7071L9.70713 16.7071C10.0977 16.3166 10.0977 15.6834 9.70713 15.2929C9.3166 14.9024 8.68344 14.9024 8.29291 15.2929L7.00002 16.5858V5ZM13 6C12.4477 6 12 6.44772 12 7C12 7.55228 12.4477 8 13 8H14C14.5523 8 15 7.55228 15 7C15 6.44772 14.5523 6 14 6H13ZM13 11C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13ZM13 16C12.4477 16 12 16.4477 12 17C12 17.5523 12.4477 18 13 18H21C21.5523 18 22 17.5523 22 17C22 16.4477 21.5523 16 21 16H13Z" fill="#000000" />
                                </svg>
                                :
                                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.00002 5C7.00002 4.44772 6.5523 4 6.00002 4C5.44773 4 5.00002 4.44772 5.00002 5V16.5858L3.7071 15.2929C3.31658 14.9024 2.68341 14.9024 2.29289 15.2929C1.90237 15.6834 1.90237 16.3166 2.2929 16.7071L5.29291 19.7071C5.48045 19.8946 5.73481 20 6.00002 20C6.26524 20 6.51959 19.8946 6.70713 19.7071L9.70711 16.7071C10.0976 16.3166 10.0976 15.6834 9.7071 15.2929C9.31658 14.9024 8.68341 14.9024 8.29289 15.2929L7.00002 16.5858V5ZM13 6C12.4477 6 12 6.44772 12 7C12 7.55228 12.4477 8 13 8H21C21.5523 8 22 7.55228 22 7C22 6.44772 21.5523 6 21 6H13ZM13 11C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13ZM13 16C12.4477 16 12 16.4477 12 17C12 17.5523 12.4477 18 13 18H14C14.5523 18 15 17.5523 15 17C15 16.4477 14.5523 16 14 16H13Z" fill="#000000" />
                                </svg>
                            }
                        </button>
                    </div>
                </div>
                <div className='games-container'>
                    {currentGames.length === 0 ? <label className='no-games'>Aucun jeu trouvé 😭</label> :
                        currentGames.map((game) => (
                            <Game key={game.id} game={game} addToCart={addToCart} height={150} />
                        ))}
                </div>
                <div className='pagination'>
                    {Array.from({ length: Math.ceil(gamesFiltered.length / gamesPerPage) }, (_, index) => (
                        <button key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''} 
                            style={{ borderRadius: '5px', transition: '0.3s'}}
                            onMouseEnter={(event) => event.target.style.backgroundColor = '#303f9f'}
                            onMouseLeave={(event) => event.target.style.backgroundColor = '#3f51b5'}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Games;
