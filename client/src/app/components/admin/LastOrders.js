import "./LastOrders.css";

const LastOrders = ({ orders }) => {
    return (
        <div className="last-orders">
            <label className="title">Dernières commandes</label>
            <div className="orders-container">
                {orders.map((order) => (
                    <div key={order.id} className="order">
                        <label className="order-id">Order #{order.id}</label>
                        <label className="order-date">{new Date(order.creationDateTime).toLocaleString()}</label>
                        <label className="order-total">Total: {order.total} €</label>
                    </div>
                ))}
            </div>
            <button className="view-all-orders"
                onClick={() => window.location.href = '/admin-orders'}
            >Voir toutes les commandes</button>
        </div>
    );
};

export default LastOrders;