import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Library, Calendar, ArrowLeft, Film } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../lib/utils';

type Movie = {
  id: string;
  title: string;
  image: string;
  category: string;
  description?: string;
  duration?: string;
};

type PurchasedMovie = {
  movie: Movie;
  purchaseDate: string;
  amount: number;
};

export default function MyLibraryPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [purchasedMovies, setPurchasedMovies] = useState<PurchasedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setError('Vous devez être connecté pour voir votre bibliothèque.');
      setIsLoading(false);
      return;
    }

    async function fetchPurchasedMovies() {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Query purchasedMovies where userId matches the authenticated user
        const purchasedQuery = query(
          collection(db, 'purchasedMovies'),
          where('userId', '==', user.id)
        );
        const purchasedSnapshot = await getDocs(purchasedQuery);

        console.log('Purchased movies:', purchasedSnapshot.docs.map(doc => doc.data()));

        const movieIds = purchasedSnapshot.docs.map(doc => doc.data().movieId);
        const purchases: PurchasedMovie[] = [];

        // 2. Batch fetch movie details for performance
        if (movieIds.length > 0) {
          // Firestore 'in' query supports up to 10 IDs at a time
          const chunkSize = 10;
          const movieIdChunks = [];
          for (let i = 0; i < movieIds.length; i += chunkSize) {
            movieIdChunks.push(movieIds.slice(i, i + chunkSize));
          }

          const moviesMap = new Map<string, any>();

          for (const chunk of movieIdChunks) {
            const moviesQuery = query(
              collection(db, 'movies'),
              where('__name__', 'in', chunk)
            );
            const moviesSnapshot = await getDocs(moviesQuery);
            moviesSnapshot.docs.forEach(doc => {
              moviesMap.set(doc.id, doc.data());
            });
          }

          // 3. Build purchased movies list
          for (const purchaseDoc of purchasedSnapshot.docs) {
            const purchaseData = purchaseDoc.data();
            const movieData = moviesMap.get(purchaseData.movieId);

            if (movieData) {
              purchases.push({
                movie: {
                  id: purchaseData.movieId,
                  title: movieData.title || 'Film indisponible',
                  image: movieData.image || '/path/to/placeholder-image.jpg', // Replace with your placeholder
                  category: movieData.category || 'Inconnu',
                  description: movieData.description || 'Aucune description disponible.',
                  duration: movieData.duration || 'N/A',
                },
                purchaseDate: purchaseData.purchaseDate?.toDate().toISOString() || new Date().toISOString(),
                amount: purchaseData.amount || 0,
              });
            } else {
              console.warn(`Movie with ID ${purchaseData.movieId} not found.`);
            }
          }
        }

        setPurchasedMovies(purchases);
      } catch (error) {
        console.error('Error fetching purchased movies:', error);
        setError('Erreur lors du chargement de votre bibliothèque. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPurchasedMovies();
  }, [isAuthenticated, user?.id]);

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <p className="text-red-500">{error}</p>
        <Link to="/" className="btn btn-primary mt-4">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Link
        to="/"
        className="inline-flex items-center text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft size={16} className="mr-2" />
        Retour à l'accueil
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Library size={32} className="text-primary" />
        <h1 className="text-3xl font-bold">Ma Bibliothèque</h1>
      </div>

      {purchasedMovies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedMovies.map(({ movie, purchaseDate, amount }) => (
            <div key={movie.id} className="bg-card rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-video">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {movie.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar size={14} />
                    Acheté le {formatDate(purchaseDate)}
                  </span>
                  <span className="text-sm font-medium">{movie.category}</span>
                </div>
                <div className="mb-4 text-sm font-medium">Montant payé: {amount.toFixed(2)} €</div>
                <Link
                  to={`/watch/${movie.id}`}
                  className="btn btn-primary w-full"
                >
                  Regarder
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Film size={64} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Votre bibliothèque est vide</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Vous n'avez pas encore acheté de contenu. Explorez notre catalogue et commencez à enrichir votre bibliothèque !
          </p>
          <Link to="/categories/all" className="btn btn-primary">
            Explorer le catalogue
          </Link>
        </div>
      )}
    </div>
  );
}