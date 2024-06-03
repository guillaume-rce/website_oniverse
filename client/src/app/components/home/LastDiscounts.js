import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import './LastDiscounts.css';

const LastDiscounts = () => {
    const [publicDiscounts, setPublicDiscounts] = useState([]);
    const [error, setError] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3001/discount-codes/public')
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch public discount codes', error);
                    setError('Failed to fetch public discount codes');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No public discount codes found');
                    return;
                }

                setPublicDiscounts(data.filter((discount) => discount.usable));
            });
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);
        }, (err) => {
            console.error('Failed to copy text: ', err);
        });
    };

    if (error) {
        return (<div className="last-discounts">
            <label className="discount-title">Codes de réduction</label>
            <div>{error}</div>
        </div>)
    }

    return (
        <div className="last-discounts">
            <label className="discount-title">Codes de réduction</label>
            {
                publicDiscounts.length === 0 ?
                    <div>Il n'y a pas de codes de réduction publics. 😢</div>
                    :
                    <motion.div 
                        className="discounts"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {publicDiscounts.map((discount) => (
                            <motion.div 
                                key={discount.id} 
                                className="discount"
                                whileHover={{ scale: 1.1, rotate: 3 }}
                                whileTap={{ scale: 0.95, rotate: -3 }}
                                onClick={() => copyToClipboard(discount.name)}
                            >
                                <div className="discount-code-name">{discount.name}</div>
                                <div className="discount-code-value">{discount.value} %</div>
                            </motion.div>
                        ))}
                    </motion.div>
            }
            {showTooltip && <motion.div 
                className="tooltip"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
            >
                Copié dans le presse-papier !
            </motion.div>}
        </div>
    );
}

export default LastDiscounts;
