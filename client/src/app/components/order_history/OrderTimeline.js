import "./OrderTimeline.css";

const OrderTimeline = ({ order }) => {
    const isMitigated = order.state === "MITIGE";
    const timelineColor = isMitigated ? "red" : "green";
    const states = ["Confirmed", "In preparation", "Send", "Received", "Closed"]
    // Capitalize and replace underscore with space for database compatibility
    const currentState = order.state.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()).replace("_", " ");
    const stateIndex = isMitigated ? states.indexOf("Closed") : states.indexOf(currentState);

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleDateString();
    };

    return (
        <div className="timeline-container">
            <div className="timeline-line" />
            <div className="timeline-items-container">
                {states.map((state, index) => (
                    <div key={state} className="timeline-item-container">
                        <label>{state}</label>
                        <div key={state}
                            className={`timeline-item ${index <= stateIndex ? 'active' : ''}`}
                            style={{ backgroundColor: index <= stateIndex ? timelineColor : '#ccc' }} />
                        {index === stateIndex && <label className="timeline-update-date">{formatDate(order.lastUpdateDateTime)}</label>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrderTimeline;