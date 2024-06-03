import React, { useState, useEffect } from 'react';
import DiscountCode from './DiscountCode';

import './DiscountCodes.css';

const DiscountCodes = () => {
    const [discountCodes, setDiscountCodes] = useState([]);
    const [adding, setAdding] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/discount-codes')
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch discount codes', error);
                    setError('Failed to fetch discount codes');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No discount codes found');
                    return;
                }
                
                setDiscountCodes(data);
            });
    }, []);

    const handleClick = (event) => {
        setAdding(!adding);
        if (!adding) { // Only adjust position and show modal if we are opening
            setMousePosition({
                x: event.clientX,
                y: 1150
            });
            setShowModal(true);
        }
    }

    useEffect(() => {
        if (!adding) {
            setTimeout(() => setShowModal(false), 300); // Delay to play out animation
        }
    }, [adding]);

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch('http://localhost:3001/discount-codes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, value, usable: false, public: isPublic }),
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to create discount code', error);
                    setError('Failed to create discount code: ' + error);
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('Failed to create discount code');
                    setError('Failed to create discount code');
                    return;
                }

                const newDiscountCode = {
                    id: data.id,
                    name: name,
                    value: value,
                    usable: false,
                    public: isPublic,
                }
                setDiscountCodes([...discountCodes, newDiscountCode]);
                setName('');
                setValue('');
                setAdding(false);
            });
    }

    const deleteDiscountCode = (discountCode, event) => {
        fetch(`http://localhost:3001/discount-codes/${discountCode.id}`, {
            method: 'DELETE',
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to delete discount code', error);
                    setError('Failed to delete discount code: ' + error);
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('Failed to delete discount code');
                    setError('Failed to delete discount code');
                    return;
                }

                setDiscountCodes(discountCodes.filter((code) => code.id !== discountCode.id));
            });
    };

    if (error) {
        return <div className="DiscountCodes">{error}</div>;
    }

    return (
        <div className="DiscountCodes">
            <label className="title">Codes de réduction</label>
            <div className="DiscountCodes-body">
                {discountCodes.length === 0 ?
                    <div className="no-discount-codes">Aucun code de réduction</div>
                    :
                    <div className="DiscountCodes-container">
                        {discountCodes.map((discountCode, index) => (
                            <DiscountCode key={index} discountCode={discountCode} deleteDiscountCode={deleteDiscountCode} />
                        ))}
                    </div>
                }
                <button onClick={handleClick} className="add-discount-code">
                    <svg className={`add-discount-code-icon ${adding ? "cross" : ""}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" fill="#fff">
                        <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                </button>
            </div>
            {showModal && (
                <div className={`modal ${adding ? 'fade-in' : 'fade-out'}`} style={{ top: mousePosition.y, left: mousePosition.x }}>
                    <form onSubmit={handleSubmit} className="modal-content">
                        <input type="text" placeholder="Nom du code" value={name} onChange={e => setName(e.target.value)} required />
                        <input type="number" placeholder="Valeur du code (%)" value={value} onChange={e => setValue(e.target.value)} required />
                        <div className="public-checkbox">
                            <input type="checkbox" id="public" name="public" value={isPublic} onChange={e => setIsPublic(e.target.checked)} />
                            <label htmlFor="public">Est public</label>
                        </div>
                        <button type="submit" className="modal-button">Valider</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default DiscountCodes;
