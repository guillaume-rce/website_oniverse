import defaultProfileImage from '../../../res/default/profile.jpg';
import admin from '../../../res/icon/admin.png';

import './ProfileInfo.css';

function ProfileInfo({ profileImage, username, creationDate, role }) {

    return (
        <div className="profile_main">
            <div alt="Profile" className="profile_image" style={{ backgroundImage: `url(${profileImage || defaultProfileImage})` }} >
                {role === 1 && <img src={admin} alt="Admin" className="profile_admin" />}
            </div>
            <div className="profile_info">
                <div className="profile_username_container">
                    <div className="profile_username">{username}</div>
                </div>

                <div className="profile_creation">Membre depuis {Math.floor((new Date() - new Date(creationDate)) / (1000 * 60 * 60 * 24))} jours</div>
            </div>
        </div>
    );
}

export default ProfileInfo;