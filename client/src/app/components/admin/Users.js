import './Users.css';
import User from './User';

const Users = ({ users }) => {
    return (
        <div className="report-users">
            <label className="title">Utilisateurs</label>
            <div className="report-users-container">
                {users.map((user) => (
                    <User key={user.id} user={user} />
                ))}
            </div>
            <button className="view-all-users"
                onClick={() => window.location.href = '/admin-users'}
            >Voir tous les utilisateurs</button>
        </div>
    );
}

export default Users;