import './Order.css';

const Order = ({ order }) => {
    var backgroundColor = '#f5f5f5';
    if (order.state === 'MITIGE') {
        backgroundColor = '#f5b7b1';
    }
    else if (order.state === 'CLOSED') {
        backgroundColor = '#abebc6';
    }

    return (
        <div key={order.id} className="order" onClick={() => window.location.href = `/admin/orders/${order.id}`}
            style={{ backgroundColor: backgroundColor }} >
            <label className="order-id">Order #{order.id}</label>
            <label className="order-date">{new Date(order.creationDateTime).toLocaleString()}</label>
            <label className="order-total">Total: {order.total} €</label>
        </div>
    );
}

export default Order;