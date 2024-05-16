import './Order.css';

const Order = ({ order }) => {
    return (
        <div key={order.id} className="order" onClick={() => window.location.href = `/admin/orders/${order.id}`}>
            <label className="order-id">Order #{order.id}</label>
            <label className="order-date">{new Date(order.creationDateTime).toLocaleString()}</label>
            <label className="order-total">Total: {order.total} €</label>
        </div>
    );
}

export default Order;