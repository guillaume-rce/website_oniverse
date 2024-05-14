import { useState, useEffect } from 'react';
import DeliveryMethod from './DeliveryMethod';
import './DeliveryMethods.css';

const DeliveryMethods = ({ deliveryMethods }) => {
    const [adding, setAdding] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [error, setError] = useState('');

    const handleClick = (event) => {
        setAdding(!adding);
        if (!adding) { // Only adjust position and show modal if we are opening
            setMousePosition({
                x: event.clientX,
                y: event.clientY
            });
            setShowModal(true);
        }
    };

    useEffect(() => {
        if (!adding) {
            setTimeout(() => setShowModal(false), 300); // Delay to play out animation
        }
    }, [adding]);

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch('http://localhost:3001/delivery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, cost: price }),
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to create delivery method', error);
                    setError('Failed to create delivery method: ' + error);
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('Failed to create delivery method');
                    setError('Failed to create delivery method');
                    return;
                }

                deliveryMethods.push(data);
                setName('');
                setPrice('');
                setAdding(false);
            });
    };

    return (
        <div className="delivery-methods">
            <label className="title">Méthodes de livraison</label>
            <div className="delivery-methods-body">
                <div className="delivery-methods-container">
                    {deliveryMethods.map((deliveryMethod) => (
                        <DeliveryMethod key={deliveryMethod.id} deliveryMethod={deliveryMethod} />
                    ))}
                </div>
                <button className="add-delivery-method" onClick={handleClick}>
                    <svg className={`add-delivery-method-icon ${adding ? "cross" : ""}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" fill="#fff">
                        <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                </button>
                {showModal && (
                    <div className={`modal ${adding ? 'fade-in' : 'fade-out'}`} style={{ top: `${mousePosition.y}px`, left: `${mousePosition.x}px` }}>
                        <form onSubmit={handleSubmit} className="modal-content">
                            <input type="text" placeholder="Nom de la méthode" value={name} onChange={e => setName(e.target.value)} required />
                            <input type="number" placeholder="Prix" step="0.1" value={price} onChange={e => setPrice(e.target.value)} required />
                            <button type="submit">Valider</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DeliveryMethods;
