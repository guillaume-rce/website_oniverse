import React, { useState, useEffect } from 'react';
import back from '../../res/icon/left-arrow.png';
import shopping from '../../res/icon/shopping-cart.png';

import './Profile.css';

import Banner from '../components/profile/Banner';
import ProfileInfo from '../components/profile/ProfileInfo';
import Game from '../components/profile/Game';

function Profile() {
    // vous pouvez récupérer l'ID de l'utilisateur à partir du stockage local
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [bannerImage, setBannerImage] = useState('');
    const [creationDate, setCreationDate] = useState('');
    const [bio, setBio] = useState('Pas de bio ?\nPas de problème... Vous êtes mystérieux ! 😎');
    const [role, setRole] = useState(0); // 0: utilisateur, 1: administrateur
    const [games, setGames] = useState([]);
    const [achievements, setAchievements] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');

    const [overBanner, setOverBanner] = useState(false);
    const [overProfile, setOverProfile] = useState(false);


    // Récupérer les informations de l'utilisateur
    const url = `http://localhost:3001/user/${userId}`;
    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    setUsername(data.pseudo);
                    setEmail(data.email);
                    setProfileImage(data.image);
                    setBannerImage(data.banner);
                    data.bio && setBio(data.bio);
                    console.log(data.role);
                    setRole(data.role);
                    setCreationDate(data.registrationDateTime);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
                    setErrorMessage('Erreur lors de la récupération des informations de l\'utilisateur');
                });
        } else {
            localStorage.removeItem('token') || sessionStorage.removeItem('token');
            localStorage.removeItem('userId') || sessionStorage.removeItem('userId');
            window.location.href = '/login';
        }
    }, [url]);

    // Récupérer les jeux de l'utilisateur
    useEffect(() => {
        fetch(`http://localhost:3001/user/${userId}/games`)
            .then(response => response.json())
            .then(data => {
                if (!data || data.length === 0 || data.error) {
                    console.error('Aucun jeu trouvé pour l\'utilisateur');
                    return;
                }
                setGames(data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des jeux de l\'utilisateur :', error);
            });
    }, [userId]);

    function uploadProfileImage(file, type) {
        if (type !== 'profile' && type !== 'banner') {
            console.error('Type de fichier non pris en charge');
            return;
        }
        const url = `http://localhost:3001/user/image/${type}`;
        const formData = new FormData();
        formData.append('image', file);

        fetch(url, {
            method: 'POST',
            headers: {
                userId,
                token: localStorage.getItem('token') || sessionStorage.getItem('token')
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setProfileImage(data.profileImage);
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour de l\'image de profil :', error);
                setErrorMessage('Erreur lors de la mise à jour de l\'image de profil');
            });
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    if (!username) {
        return <div>Chargement...</div>;
    }

    console.log('games', games);

    return (
        <div className="profile_container">
            <div className="profile_back_home_button" onClick={() => window.location.href = '/'}>
                <img src={back} alt="Back" className="profile_back_home_button_img" />
                <text className="profile_back_home_button_text">Retour à l'accueil</text>
            </div>

            <Banner bannerImage={bannerImage} onFileReady={uploadProfileImage} />

            <ProfileInfo profileImage={profileImage} username={username}
                creationDate={creationDate} role={role}
                onFileReady={uploadProfileImage} />

            <div className="profile_info_main_container">
                <div className="profile_info_container">
                    <div className="profile_info_title">Bio</div>
                    <text className="profile_info_content_text" style={{ whiteSpace: 'pre-line' }}>{bio}</text>
                </div>
            </div>

            <div className="profile_games_info_container profile_info_main_container">
                <div className="profile_info_container profile_achievements_container">
                    <div className="profile_info_title">Achievements</div>
                    <div className="profile_info_content">
                        {
                            achievements.length === 0 ?
                                // Si l'utilisateur n'a pas de succès, affichez un message
                                <text className='profile_info_content_text'>Un peu de travail et vous aurez des succès ! 🏆</text>
                                :
                                // Sinon, affichez les succès de l'utilisateur
                                <div>
                                    {achievements.map(achievement => (
                                        <div key={achievement.id} className="profile_achievement">
                                            <img src={achievement.image} alt={achievement.name} className="profile_achievement_image" />
                                            <text className="profile_achievement_name">{achievement.name}</text>
                                        </div>
                                    ))}
                                </div>
                        }
                    </div>
                </div>

                <div className="profile_info_container profile_games_container">
                    <div className="profile_info_title">Games</div>
                    <div className="profile_info_content">
                        {
                            games.length === 0 ?
                                // Si l'utilisateur n'a pas de jeu, affichez un message et un bouton pour ajouter un jeu
                                <div>
                                    <text className='profile_info_content_text'>Vous n'avez pas de jeu pour le moment... 😢</text>
                                    <button className="profile_add_game_button" onClick={() => window.location.href = '/'}>Ajouter un jeu</button>
                                </div>
                                :
                                // Sinon, affichez les jeux de l'utilisateur
                                <div className="profile_games">
                                    {games.map(game => (
                                        <Game key={game.id} game={game} />
                                    ))}
                                </div>
                        }
                    </div>
                </div>
            </div>

            <div className="profile_go_order_history" onClick={() => window.location.href = '/orders'}>
                <img src={shopping} alt="Order history" className="profile_go_order_history_img" />
                <text className="profile_go_order_history_text">Mes commandes</text>
            </div>
        </div>
    );
}
export default Profile;