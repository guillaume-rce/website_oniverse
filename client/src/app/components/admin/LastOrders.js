import "./LastOrders.css";
import Order from "./Order";

const LastOrders = ({ orders }) => {
    return (
        <div className="last-orders">
            <label className="title">Dernières commandes</label>
            <div className="orders-container">
                {orders.map((order) => (
                    <Order key={order.id} order={order} />
                ))}
            </div>
            <button className="view-all-orders"
                onClick={() => window.location.href = '/admin/orders'}
            >Voir toutes les commandes</button>
        </div>
    );
};

export default LastOrders;