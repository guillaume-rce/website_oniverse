import React from 'react';
import './ShoppingCart.css';

const ShoppingCart = () => {
    return (
        <div className="shopping-cart">
            <div className="cart-items">
                <h2>Shopping Cart</h2>
                
                <div className="item">
                    <img src="shirt2.jpg" alt="Shirt" />
                    <div>
                        <p>Shirt</p>
                        <p>Cotton T-shirt</p>
                    </div>
                    <div className="quantity">
                        <button>-</button>
                        <input type="number" value="1" readOnly />
                        <button>+</button>
                    </div>
                    <p>€ 44.00</p>
                    <button className="remove">x</button>
                </div>
                <div className="item">
                    <img src="shirt3.jpg" alt="Shirt" />
                    <div>
                        <p>Shirt</p>
                        <p>Cotton T-shirt</p>
                    </div>
                    <div className="quantity">
                        <button>-</button>
                        <input type="number" value="1" readOnly />
                        <button>+</button>
                    </div>
                    <p>€ 44.00</p>
                    <button className="remove">x</button>
                </div>
                <a href="#">← Back to shop</a>
            </div>
            <div className="summary">
                <h2>Summary</h2>
                <div className="summary-item">
                    <span>ITEMS 3</span>
                    <span>€ 132.00</span>
                </div>
                <div className="summary-item">
                    <span>SHIPPING</span>
                    <select>
                        <option>Standard-Delivery-€5.00</option>
                    </select>
                </div>
                <div className="summary-item">
                    <span>GIVE CODE</span>
                    <input type="text" placeholder="Enter your code" />
                </div>
                <div className="summary-item total">
                    <span>TOTAL PRICE</span>
                    <span>€ 137.00</span>
                </div>
                <button className="register">REGISTER</button>
            </div>
        </div>
    );
};

export default ShoppingCart;
