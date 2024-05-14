import { useState } from "react";

const DeliveryMethod = ({ deliveryMethod }) => {
    const [available, setAvailable] = useState(deliveryMethod.available);

    const stateColors = {
        'active': ' #abebc6',
        'inactive': '#f5b7b1',
    };

    const toggleAvailability = () => {
        setAvailable(!available);

        fetch(`http://localhost:3001/delivery/${deliveryMethod.id}/available`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ available: !available }),
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to update delivery method availability', error);
                    setAvailable(available);
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('Failed to update delivery method availability');
                    setAvailable(available);
                    return;
                }
            });
    }

    return (
        <div className="delivery-method" key={deliveryMethod.id}
            style={{ backgroundColor: available ? stateColors.active : stateColors.inactive }}
            onClick={toggleAvailability}>
            <label className="delivery-method-name">{deliveryMethod.name}</label>
            <label className="delivery-method-price">{deliveryMethod.cost} €</label>
        </div>
    );
}

export default DeliveryMethod;