const { useState, useEffect } = require("react");

const DiscountCode = ({ discountCode, deleteDiscountCode }) => {
    const [usable, setUsable] = useState(discountCode.usable);
    const [publicCode, setPublicCode] = useState(discountCode.public);
    const [used, setUsed] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3001/discount-codes/${discountCode.id}/used`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to get discount code usage', error);
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

    const toggleUsability = () => {
        setUsable(!usable);

        fetch(`http://localhost:3001/discount-codes/${discountCode.id}/usable`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usable: !usable }),
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to update discount code usability', error);
                    setUsable(usable);
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('Failed to update discount code usability');
                    setUsable(usable);
                    return;
                }
            });
    }

    const togglePublic = (event) => {
        event.stopPropagation();

        fetch(`http://localhost:3001/discount-codes/${discountCode.id}/public`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public: !publicCode }),
        })
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to update discount code public status', error);
                    setPublicCode(publicCode);
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('Failed to update discount code public status');
                    setPublicCode(publicCode);
                    return;
                }

                setPublicCode(!publicCode);
            });
    }

    return (
        <button className="discount-code-admin" key={discountCode.id}
            style={{ backgroundColor: usable ? stateColors.active : stateColors.inactive }}
            onClick={toggleUsability}>
            <div className="discount-code-info-admin">
                <label className="discount-code-name-admin">{discountCode.name}</label>
                <label className="discount-code-value-admin">{discountCode.value} %</label>
            </div>
            {
                !used ?
                    <button className="discount-code-delete" onClick={(event) => deleteDiscountCode(discountCode, event)}>
                        <svg className="delete-tag-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" fill="#f00">
                            <path d="M19 6H15V4H9V6H5V8H19V6ZM17 10H7L8 18H16L17 10Z" />
                        </svg>
                    </button>
                    :
                    <button className="discount-code-delete">
                        <svg className="delete-tag-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" fill="#faa">
                            <path d="M19 6H15V4H9V6H5V8H19V6ZM17 10H7L8 18H16L17 10Z" />
                        </svg>
                    </button>
            }
            {
                publicCode ?
                    <button className="discount-code-public" onClick={togglePublic}>
                        <svg className="public-tag-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill="#000">
                            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                        </svg>
                    </button>
                    :
                    <button className="discount-code-public" onClick={togglePublic}>
                        <svg className="public-tag-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill="#000">
                            <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                        </svg>
                    </button>
            }
        </button>
    );
}

export default DiscountCode;