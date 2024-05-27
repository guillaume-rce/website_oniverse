import React, { useState, useEffect } from 'react';
import logo from '../../res/logo_1920_1080_nobg.png';
import shoppingCart from '../../res/icon/shopping-cart.png';
import defaultProfileImage from '../../res/default/profile.jpg';
import ShippingCart from './header/ShoppingCart';
import ProfileCart from './header/ProfileCart';
import SearchCart from './header/SearchCart';
import { useCart } from '../CartContext';
import './Header.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


function Header(props) {
    const { cart } = useCart();

    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const [profileImage, setProfileImage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [opacity, setOpacity] = useState(0);
    const [isCartVisible, setCartVisible] = useState(false);
    const [isProfileVisible, setProfileVisible] = useState(false);

    const [games, setGames] = useState([]);
    const [users, setUsers] = useState({});
    const [gamesSearch, setGamesSearch] = useState([]);
    const [usersSearch, setUsersSearch] = useState([]);
    const [isSearchVisible, setSearchVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollDistance = document.documentElement.scrollTop || document.body.scrollTop;
            const newOpacity = Math.min(1, scrollDistance / 100);
            setOpacity(newOpacity);
            if (newOpacity === 0) {
                setCartVisible(false);
                setProfileVisible(false);
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:3001/user/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setProfileImage(data.image);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
                    setErrorMessage('Erreur lors de la récupération des informations de l\'utilisateur');
                });
        }
    }, []);

    useEffect(() => {
        fetch('http://localhost:3001/games')
            .then(response => response.json())
            .then(data => {
                if (!data) {
                    console.error('No games found');
                    return;
                }
                if (data.error) {
                    console.error('Error while fetching games:', data.error);
                    setErrorMessage('Error while fetching games');
                    return;
                }
                setGames(data);
            })
            .catch(error => {
                console.error('Failed to fetch games:', error);
                setErrorMessage('Failed to fetch games');
            });

        fetch('http://localhost:3001/users')
            .then(response => response.json())
            .then(data => {
                if (!data) {
                    console.error('No users found');
                    return;
                }
                if (data.error) {
                    console.error('Error while fetching users:', data.error);
                    setErrorMessage('Error while fetching users');
                    return;
                }
                setUsers(data);
            })
            .catch(error => {
                console.error('Failed to fetch users:', error);
                setErrorMessage('Failed to fetch users');
            });
    }, []);

    const toggleCart = () => {
        setCartVisible(!isCartVisible);
        setProfileVisible(false);
        setSearchVisible(false);
    };

    const toggleProfile = () => {
        setProfileVisible(!isProfileVisible);
        setCartVisible(false);
        setSearchVisible(false);
    };

    const handleSearch = (searchValue) => {
        setGamesSearch([]);
        setUsersSearch([]);
    
        if (searchValue.length > 0) {
            setSearchVisible(true);
            setCartVisible(false);
            setProfileVisible(false);

            const searchValueFormatted = searchValue.toLowerCase();
    
            /* Search for games */
            let gamesSearch = [];
            games.forEach(game => {
                const nameFormatted = game.name.toLowerCase();
                const tagsFormatted = game.tags.map(tag => tag.name.toLowerCase());
                if (nameFormatted.includes(searchValueFormatted) || tagsFormatted.some(tag => tag.includes(searchValueFormatted))) {
                    gamesSearch.push({
                        image: game.logo ? game.logo.path : game.image.path,
                        title: game.name,
                        url: `/detail/${game.id}`
                    });
                }
            });
            setGamesSearch(gamesSearch);
    
            /* Search for users */
            let usersSearch = [];
            users.forEach(user => {
                const pseudoFormatted = user.pseudo.toLowerCase();
                if (pseudoFormatted.includes(searchValueFormatted)) {
                    usersSearch.push({
                        image: user.image ? user.image : defaultProfileImage,
                        title: user.pseudo,
                        url: `/user/${user.id}`
                    });
                }
            });
            setUsersSearch(usersSearch);
    
        } else {
            setSearchVisible(false);
        }
    };

    const getCartLength = () => {
        let length = 0;
        cart.forEach(game => {
            length += game.quantity;
        });
        return length;
    }

    return (
        <div className='header_container'>
            {opacity !== 0 || !props.hide ? (
                <header className='header' style={(props.hide ? { opacity } : {})} >
                    <img src={logo} alt="Logo" className='header_logo' />
                    <ul className='header_nav'>
                        <li className='header_nav_item'><Link to='/'>Home</Link></li>
                        <li className='header_nav_item'><a href='/games'>Games</a></li>
                        <li className='header_nav_item'><a href='#news'>News</a></li>
                        <li className='header_nav_item'><a href='#about'>About</a></li>
                    </ul>
                    <div className='header_search'>
                        <input type='text' placeholder='Rechercher' className='header_search_input'
                            onChange={(e) => handleSearch(e.target.value)} />
                        <div className='header_search_button'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="100%" height="100%">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                        </div>
                    </div>
                    <button className='header_cart' onClick={toggleCart}>
                        <img src={shoppingCart} alt="Shopping cart" className='header_cart_img' />
                        { getCartLength() > 0 && 
                            <div className='header_cart_number'></div>}
                    </button>
                    <div className='header_profile'>
                        <img src={profileImage || defaultProfileImage} alt="Profile" className='header_profile_img'
                            onClick={() => userId ? toggleProfile() : window.location.href = '/auth'} />
                    </div>
                    {isProfileVisible && <ProfileCart />}
                    {isCartVisible && <ShippingCart />}
                    {isSearchVisible && <SearchCart games={gamesSearch} users={usersSearch} />}
                </header>
            ) : (
                null
            )}
        </div>
    );
}

export default Header;
