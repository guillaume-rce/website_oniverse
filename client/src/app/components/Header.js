import React, { useState, useEffect } from 'react';
import logo from '../../res/logo_1920_1080_nobg.png';
import shoppingCart from '../../res/icon/shopping-cart.png';
import defaultProfileImage from '../../res/default/profile.jpg';
import ShippingCart from './home/ShoppingCart';
import ProfileCart from './home/ProfileCart';
import './Header.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


function Header(props) {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const [profileImage, setProfileImage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [opacity, setOpacity] = useState(0);
    const [isCartVisible, setCartVisible] = useState(false);
    const [isProfileVisible, setProfileVisible] = useState(false);

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

    const toggleCart = () => {
        setCartVisible(!isCartVisible);
        setProfileVisible(false);
    };

    const toggleProfile = () => {
        setProfileVisible(!isProfileVisible);
        setCartVisible(false);
    };

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
                    <button className='header_cart' onClick={toggleCart}>
                        <img src={shoppingCart} alt="Shopping cart" className='header_cart_img' />
                    </button>
                    <div className='header_profile'>
                        <img src={profileImage || defaultProfileImage} alt="Profile" className='header_profile_img'
                            onClick={() => userId ? toggleProfile() : window.location.href = '/auth'} />
                    </div>
                    {isProfileVisible && <ProfileCart />}
                    {isCartVisible && <ShippingCart />}
                </header>
            ) : (
                null
            )}
        </div>
    );
}

export default Header;
