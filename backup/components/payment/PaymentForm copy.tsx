import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../store/moviesStore';
import { formatCurrency } from '../../lib/utils';
import { Phone, CreditCard, CheckCircle } from 'lucide-react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import airtelMoneyLogo from '../../assets/airtel.jpg';
import mpesaLogo from '../../assets/mpesa.jpg';
import orangeMoneyLogo from '../../assets/orange.jpg';
import visaLogo from '../../assets/visa.jpg';
import mastercardLogo from '../../assets/master.jpg';


type PaymentFormProps = {
  movie: Movie;
  onSubmit: (paymentData: any) => Promise<{ success: boolean; transactionId?: string }>;
};

export default function PaymentForm({ movie, onSubmit }: PaymentFormProps) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [countdown, setCountdown] = useState(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    setStatusMessage('');
    setCountdown(30);

    try {
      if (paymentMethod === 'mobile') {
        if (!mobileNumber || mobileNumber.length < 10) {
          throw new Error('Veuillez entrer un numéro de téléphone valide');
        }

        setStatusMessage(`⏳ En attente de confirmation sur le téléphone... (${countdown}s)`);

        const res = await axios.post("http://localhost:4000/api/kelpay-pay", {
          mobilenumber: mobileNumber,
          amount: movie.price,
        });

        const { request, reference } = res.data;

        if (request.code !== "0") {
          throw new Error(`Erreur de requête: ${request.description}`);
        }

        let timePassed = 0;
        const intervalMs = 4000;
        const maxTime = 30000;
        let secondsLeft = 30;

        const countdownTimer = setInterval(() => {
          secondsLeft -= 1;
          setCountdown(secondsLeft);

          if (secondsLeft <= 0) {
            clearInterval(countdownTimer);
          }
        }, 1000);

        const poll = setInterval(async () => {
          try {
            const statusRes = await axios.get(`http://localhost:4000/api/kelpay-status/${reference}`);
            const statusData = statusRes.data;

            if (statusData.status === "CONFIRMED") {
              clearInterval(poll);
              clearInterval(countdownTimer);
              setStatusMessage("✅ Paiement Mobile Money confirmé !");

              const result = await onSubmit({
                method: 'mobile',
                movieId: movie.id,
                amount: movie.price,
                reference,
              });

              if (result.success) {
                setIsSuccess(true);
                setTimeout(() => navigate(`/watch/${movie.id}`), 2000);
              } else {
                throw new Error('Paiement confirmé mais la confirmation de l\'application a échoué.');
              }
            } else if (statusData.status === "FAILED" || statusData.status === "CANCELLED") {
              clearInterval(poll);
              clearInterval(countdownTimer);
              throw new Error(`❌ Paiement échoué : ${statusData.description || "Utilisateur a annulé"}`);
            }

            timePassed += intervalMs;
            if (timePassed >= maxTime) {
              clearInterval(poll);
              clearInterval(countdownTimer);
              setStatusMessage("❌ Paiement annulé : aucune confirmation reçue dans les 30 secondes.");
              setIsSubmitting(false);
            }
          } catch (pollError: any) {
            clearInterval(poll);
            clearInterval(countdownTimer);
            setError(pollError.message || "Une erreur s'est produite pendant la vérification.");
            setIsSubmitting(false);
          }
        }, intervalMs);
      }

      if (paymentMethod === 'card') {
        if (!stripe || !elements) throw new Error('Stripe non chargé');
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error('Champ carte introuvable');

        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: { name: cardholderName },
        });

        if (stripeError) throw new Error(stripeError.message);
        const { id } = paymentMethod;

        const response = await axios.post('http://localhost:4000/payment', {
          amount: movie.price * 100,
          id,
          title: movie.title,
        });

        if (!response.data.success) throw new Error('Échec du paiement Stripe');

        const result = await onSubmit({
          method: 'card',
          movieId: movie.id,
          amount: movie.price,
          orderId: id,
        });

        if (result.success) {
          setIsSuccess(true);
          setTimeout(() => navigate(`/watch/${movie.id}`), 2000);
        } else {
          throw new Error('Paiement Stripe réussi mais la confirmation a échoué.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-10">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Paiement réussi !</h3>
        <p className="text-muted-foreground mb-4">
          Vous allez être redirigé pour regarder <strong>{movie.title}</strong>...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold mb-4 text-center">
          Veuillez sélectionner votre mode de paiement
        </h2>

        <div className="mb-6">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 ${paymentMethod === 'mobile' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => {
                setPaymentMethod('mobile');
                setCountdown(30);
              }}
            >
              <Phone size={20} />
              <span>Mobile Money</span>
            </button>
            <button
              type="button"
              className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 ${paymentMethod === 'card' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard size={20} />
              <span>Carte de Crédit</span>
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-6">
          {paymentMethod === 'mobile' && (
            <>
              <img src={airtelMoneyLogo} alt="Airtel Money" className="h-10 object-contain" />
              <img src={mpesaLogo} alt="M-Pesa" className="h-10 object-contain" />
              <img src={orangeMoneyLogo} alt="Orange Money" className="h-10 object-contain" />
            </>
          )}
          {paymentMethod === 'card' && (
            <>
              <img src={visaLogo} alt="Visa" className="h-10 object-contain" />
              <img src={mastercardLogo} alt="Mastercard" className="h-10 object-contain" />
            </>
          )}
        </div>

        {statusMessage && (
          <div className="bg-yellow-100 text-yellow-800 rounded p-2 mb-4">
            {statusMessage.includes('attente') ? (
              <>⏳ En attente de confirmation sur le téléphone... ({countdown}s)</>
            ) : (
              statusMessage
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 rounded p-2 mb-4">{error}</div>
        )}

        {paymentMethod === 'mobile' && (
          <div className="mb-4">
            <label>Numéro de téléphone</label>
            <input
              type="tel"
              className="input w-full"
              placeholder="243123456789"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
        )}

        {paymentMethod === 'card' && (
          <>
            <div className="mb-4">
              <label>Nom du titulaire</label>
              <input
                type="text"
                className="input w-full"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 border p-3 rounded">
              <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Traitement en cours...' : `Payer ${formatCurrency(movie.price)}`}
        </button>
      </form>
    </div>
  );
}