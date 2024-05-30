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
        </div>
    );
}

export default Users;