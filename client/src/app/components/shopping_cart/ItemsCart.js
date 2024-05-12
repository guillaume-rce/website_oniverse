import { useCart } from "../../CartContext";
import Item from "./Item";
import "./ItemsCart.css";

function ItemsCart() {
    const { cart } = useCart();

    return (
        <div className="cart-items">
            <h2>Shopping Cart</h2>
            { cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty :(</p>
            ) : (
                <ul className="items">
                    { cart.map((item, index) => (
                        <Item item={item} />
                    )) }
                </ul>
            ) }
            <button className="back-to-shop" onClick={() => window.location.href = "/"}>Back to shop</button>
        </div>
    );
}

export default ItemsCart;