import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  return (
    <>
      <div>
        <h2>Your Cart</h2>
        <div>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul>
              {cart.map((item: CartItem) => (
                <li key={item.bookId}>
                  {item.title}: ${item.donationAmount.toFixed(2)}
                  <button onClick={() => removeFromCart(item.bookId)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <h3>
          {' '}
          Total: $
          {cart
            .reduce((total, item) => total + item.donationAmount, 0)
            .toFixed(2)}
        </h3>
        <button onClick={() => navigate('/cart')}>Checkout</button>
        <button onClick={() => navigate('/books')}>Back to Book List</button>
      </div>
    </>
  );
}

export default CartPage;
