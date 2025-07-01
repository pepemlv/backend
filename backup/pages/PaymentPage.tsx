import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { doc, getDoc, updateDoc, arrayUnion, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import PaymentForm from '../components/payment/PaymentForm';

interface Movie {
  id: string;
  title: string;
  image: string;
  category: string;
  duration: string;
  isFree: boolean;
  price?: number;
  purchasers?: string[];
}

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirectTo=/payment/${id}`);
      return;
    }

    async function fetchMovie() {
      if (!id || !user?.id) {
        setError('ID de film ou utilisateur manquant.');
        setLoading(false);
        return;
      }

      try {
        const movieRef = doc(db, 'movies', id);
        const movieSnap = await getDoc(movieRef);

        if (!movieSnap.exists()) {
          setError('Film non trouvé.');
          navigate('/');
          return;
        }

        const movieData = { ...movieSnap.data(), id: movieSnap.id } as Movie;
        setMovie(movieData);

        if (movieData.isFree || (movieData.purchasers && movieData.purchasers.includes(user.id))) {
          navigate(`/watch/${id}`);
          return;
        }
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Erreur lors du chargement du film.');
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id, navigate, isAuthenticated, user]);

  const handlePayment = async (paymentData: any) => {
    if (!movie || !user?.id) {
      setError('Film ou utilisateur non trouvé.');
      return { success: false };
    }

    try {
      const movieRef = doc(db, 'movies', movie.id);
      await updateDoc(movieRef, {
        purchasers: arrayUnion(user.id),
      });

      await addDoc(collection(db, 'purchasedMovies'), {
        userId: user.id,
        movieId: movie.id,
        purchaseDate: Timestamp.now(),
        amount: movie.price ?? 0,
        transactionId: `TX-${Date.now()}`,
      });

      navigate(`/watch/${movie.id}`);
      return { success: true };
    } catch (error) {
      console.error('Payment or Firestore update failed:', error);
      setError('Échec du paiement. Veuillez réessayer.');
      return { success: false };
    }
  };

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="container py-12">
      <Link
        to={`/movie/${movie.id}`}
        className="inline-flex items-center text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft size={16} className="mr-2" />
        Retour aux détails
      </Link>

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Paiement</h1>

        <div className="bg-card rounded-lg overflow-hidden shadow-sm mb-6">
          <div className="aspect-video">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
            <p className="text-sm text-muted-foreground">
              {movie.category} • {movie.duration}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
          <PaymentForm movie={movie} onSubmit={handlePayment} />
        </div>

        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-primary mt-1 h-5 w-5 shrink-0" />
            <div>
              <h3 className="text-sm font-medium mb-1">Paiement sécurisé</h3>
              <p className="text-xs text-muted-foreground">
                Toutes vos transactions sont sécurisées et vos informations de paiement sont protégées.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}