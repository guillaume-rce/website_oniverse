import { useState, useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import Banner from "../components/user/Banner";
import ProfileInfo from "../components/user/ProfileInfo";
import Game from "../components/user/Game";

import back from '../../res/icon/left-arrow.png';
import shopping from '../../res/icon/shopping-cart.png';

const User = () => {
    const { userId } = useParams();
    const persUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId'); 

    if (!userId || userId === "undefined") {
        window.location.href = '/';
    }

    if (persUserId && userId === persUserId) {
        window.location.href = '/profile';
    }

    const [user, setUser] = useState({});
    const [bio, setBio] = useState('Ce joueur n\'a pas de bio... Il préfère rester mystérieux ! 😎');
    const [achievements, setAchievements] = useState([]);
    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/user/${userId}`)
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
                data.bio && setBio(data.bio);
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

    if (!user || !games) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile_container">
            <div className="profile_back_home_button" onClick={() => window.location.href = '/'}>
                <img src={back} alt="Back" className="profile_back_home_button_img" />
                <text className="profile_back_home_button_text">Retour à l'accueil</text>
            </div>

            <Banner bannerImage={user.banner} />

            <ProfileInfo profileImage={user.image} username={user.pseudo}
                creationDate={user.registrationDateTime} role={user.role} />

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
                                <text className='profile_info_content_text'>Cet utilisateur n'a pas assez travaillé pour obtenir des succès... 😢</text>
                                :
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
                                    <text className='profile_info_content_text'>Il n'a pas encore de jeu, comment est-ce possible ? 😱</text>
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
        </div>
    )
}

export default User;