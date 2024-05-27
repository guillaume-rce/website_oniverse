import { useEffect, useState } from "react";
import TooltipInfo from "../TooltipInfo";

const DeliveryMethod = ({ deliveryMethod, deleteDeliveryMethod }) => {
    const [available, setAvailable] = useState(deliveryMethod.available);
    const [used, setUsed] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3001/delivery/${deliveryMethod.id}/used`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to get delivery method usage', error);
                    setUsed(false);
                }
            )
            .then((data) => {
                if (data) {
                    setUsed(data.used);
                }
            });
    });

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
            <div className="delivery-method-info">
                <label className="delivery-method-name">{deliveryMethod.name}</label>
                <label className="delivery-method-price">{deliveryMethod.cost} €</label>
            </div>
            {used ?
                <button className="delivery-method-delete">
                    <svg className="delete-tag-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" fill="#faa">
                        <path d="M19 6H15V4H9V6H5V8H19V6ZM17 10H7L8 18H16L17 10Z" />
                    </svg>
                </button> 
                :
                <button className="delivery-method-delete" onClick={(event) => deleteDeliveryMethod(deliveryMethod, event)}>
                    <svg className="delete-tag-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" fill="#f00">
                        <path d="M19 6H15V4H9V6H5V8H19V6ZM17 10H7L8 18H16L17 10Z" />
                    </svg>
                </button>
            }
        </div>
    );
}

export default DeliveryMethod;