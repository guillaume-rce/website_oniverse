import './DeliveryMethods.css';

const DeliveryMethods = ({ deliveryMethods }) => {
    return (
        <div className="delivery-methods">
            <label className="title">Méthodes de livraison</label>
            <div className="delivery-methods-container">
                {deliveryMethods.map((deliveryMethod) => (
                    <div className="delivery-method" key={deliveryMethod.id}>
                        <label className="delivery-method-name">{deliveryMethod.name}</label>
                        <label className="delivery-method-price">{deliveryMethod.price} €</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DeliveryMethods;