import defaultAvatar from '../../../res/default/profile.jpg';

const User = ({ user }) => {
    const borderColors = user.role === 0 ? '#abebc6' : '#a0ceff';
    return (
        <div className="user" style={{ borderColor: borderColors }}
            onClick={() => window.location.href = `/admin-users/${user.id}`}>
            <label className="user-id">ID: #{user.id}</label>
            <img className="user-avatar" src={user.image ? user.image : defaultAvatar} alt="avatar" />
            <div className="user-info">
                <label className="user-name">{user.pseudo}</label>
                <label className="user-email">{user.email}</label>
            </div>
        </div>
    );
}

export default User;