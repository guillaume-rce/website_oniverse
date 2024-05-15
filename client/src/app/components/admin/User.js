const User = ({ user }) => {
    return (
        <div className="user">
            <label className="user-id">ID: {user.id}</label>
            <label className="user-name">Nom: {user.name}</label>
            <label className="user-email">Email: {user.email}</label>
            <label className="user-role">Rôle: {user.role}</label>
        </div>
    );
}

export default User;