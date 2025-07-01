import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../store/moviesStore';
import { formatCurrency } from '../../lib/utils';
import { Phone, CreditCard, CheckCircle } from 'lucide-react';

type PaymentFormProps = {
  movie: Movie;
  onSubmit: (paymentData: any) => Promise<{ success: boolean; transactionId?: string }>;
};

export default function PaymentForm({ movie, onSubmit }: PaymentFormProps) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Validate based on payment method
      if (paymentMethod === 'mobile' && (!mobileNumber || mobileNumber.length < 10)) {
        throw new Error('Please enter a valid phone number');
      }

      if (paymentMethod === 'card') {
        if (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvv || !cardInfo.cardholderName) {
          throw new Error('Please fill in all card details');
        }
        if (cardInfo.cardNumber.replace(/\s/g, '').length !== 16) {
          throw new Error('Please enter a valid card number');
        }
      }
      
      // Prepare payment data based on payment method
      const paymentData = {
        method: paymentMethod,
        movieId: movie.id,
        amount: movie.price,
        currency: 'USD',
        ...(paymentMethod === 'mobile' && { mobileNumber }),
        ...(paymentMethod === 'card' && { cardInfo })
      };
      
      // Submit payment
      const result = await onSubmit(paymentData);
      
      if (result.success) {
        setIsSuccess(true);
        // Redirect to watch page after a short delay
        setTimeout(() => {
          navigate(`/watch/${movie.id}`);
        }, 2000);
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSuccess) {
    return (
      <div className="text-center py-10">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
        <p className="text-muted-foreground mb-4">
          Your payment has been processed successfully. You will be redirected to the video...
        </p>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 p-4 bg-secondary rounded-lg">
        <h3 className="font-medium mb-2">Purchase Summary</h3>
        <div className="flex justify-between">
          <span>{movie.title}</span>
          <span className="font-semibold">{formatCurrency(movie.price)}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border border-border rounded-lg overflow-hidden">
          <button
            type="button"
            className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 ${
              paymentMethod === 'mobile' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
            onClick={() => setPaymentMethod('mobile')}
          >
            <Phone size={20} />
            <span>Mobile Money</span>
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 ${
              paymentMethod === 'card' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            <CreditCard size={20} />
            <span>Card</span>
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-destructive/20 text-destructive rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {paymentMethod === 'mobile' && (
          <div className="mb-6">
            <label htmlFor="mobileNumber\" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Ex: 243123456789"
              className="input w-full"
              required
            />
            <p className="text-xs text-muted-foreground mt-2">
              Enter your phone number in international format (ex: 243123456789)
            </p>
          </div>
        )}
        
        {paymentMethod === 'card' && (
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="cardholderName" className="block text-sm font-medium mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                id="cardholderName"
                value={cardInfo.cardholderName}
                onChange={(e) => setCardInfo({ ...cardInfo, cardholderName: e.target.value })}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                value={cardInfo.cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                  setCardInfo({ ...cardInfo, cardNumber: formatted });
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="input w-full font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  value={cardInfo.expiryDate}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) {
                      const formatted = value.match(/.{1,2}/g)?.join('/') || value;
                      setCardInfo({ ...cardInfo, expiryDate: formatted });
                    }
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="input w-full font-mono"
                  required
                />
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  value={cardInfo.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 3) {
                      setCardInfo({ ...cardInfo, cvv: value });
                    }
                  }}
                  placeholder="123"
                  maxLength={3}
                  className="input w-full font-mono"
                  required
                />
              </div>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : `Pay ${formatCurrency(movie.price)}`}
        </button>
      </form>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-primary mt-1 h-5 w-5 shrink-0" />
          <div>
            <h3 className="text-sm font-medium mb-1">Secure Payment</h3>
            <p className="text-xs text-muted-foreground">
              Your payment information is encrypted and secure. We never store your full card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}