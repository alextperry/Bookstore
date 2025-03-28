import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import { useState } from 'react';
import WelcomeHeader from '../components/WelcomeHeader';

function PurchasePage() {
  const navigate = useNavigate();
  const { title, bookId, price } = useParams();
  const { addToCart } = useCart();
  const [donationAmount, setDonationAmount] = useState<number>(
    Number(price) || 0,
  );

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      title: title || 'No Project Found',
      donationAmount: Number(donationAmount),
    };
    addToCart(newItem);
    navigate('/cart');
  };

  return (
    <div className="container mt-4">
      <WelcomeHeader />
      <div className="card p-4 shadow-lg">
        <h2 className="text-center mb-4">Purchase {title}</h2>

        <div className="form-group">
          <label className="mb-2">
            <strong>Donation Amount</strong>
          </label>
          <input
            type="number"
            className="form-control"
            placeholder={`Price: $${price}`}
            value={donationAmount}
            onChange={(e) => setDonationAmount(Number(e.target.value))}
            min="1"
          />
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-primary" onClick={handleAddToCart}>
            <i className="bi bi-cart"></i> Add to Cart
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/books')}
          >
            <i className="bi bi-arrow-left"></i> Back to Books
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchasePage;
