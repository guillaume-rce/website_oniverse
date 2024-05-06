import React, { useEffect, useState } from 'react';
import './ProfileCart.css';
import profileImage from '../../../res/icon/manage_accounts.svg';
import logoutImage from '../../../res/icon/logout.svg';

function ProfileCart() {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const [userName, setUserName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:3001/user/${userId}`)
                .then(response => response.json())
                .then(data => {
                    const pseudo = data.pseudo;
                    console.log(pseudo);
                    if (!pseudo) {
                        setUserName('unknown');
                    } else if (pseudo.length > 15) {
                        setUserName(pseudo.substring(0, 12) + '... °-°');
                    } else {
                        setUserName(pseudo);
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
                    setErrorMessage('Erreur lors de la récupération des informations de l\'utilisateur');
                });
        }
    }, []);

    function logout() {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('token');
        window.location.href = '/';
    }

    return (
        <div className="profile_cart">
            <text className="profile_cart_title">Hello, {userName}</text>
            <div className="profile_button" onClick={() => window.location.href = '/profile'}>
                <img src={profileImage} alt="Profile" className="profile_button_img" />
                <text className="profile_button_text">Profile</text>
            </div>
            <div className="profile_button" onClick={logout}>
                <img src={logoutImage} alt="Logout" className="profile_button_img" />
                <text className="profile_button_text">Logout</text>
            </div>
        </div>
    );
}

export default ProfileCart;