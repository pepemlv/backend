import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Play, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useMoviesStore, Movie } from '../store/moviesStore';
import { useAuthStore } from '../store/authStore';
import { formatCurrency, formatDate } from '../lib/utils';

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMovieById, fetchMovies, isLoading, checkIfMovieIsPurchased } = useMoviesStore();
  const { isAuthenticated } = useAuthStore();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    if (id) {
      const foundMovie = getMovieById(id);
      if (foundMovie) {
        setMovie(foundMovie);
        setIsPurchased(checkIfMovieIsPurchased(id));
      } else {
        // Movie not found, navigate to home
        navigate('/');
      }
    }
  }, [id, getMovieById, navigate, checkIfMovieIsPurchased]);

  if (isLoading || !movie) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-secondary rounded w-1/2 mb-4"></div>
          <div className="h-96 bg-secondary rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-secondary rounded w-full"></div>
            <div className="h-4 bg-secondary rounded w-3/4"></div>
            <div className="h-4 bg-secondary rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50" />
        </div>

        <div className="relative pt-16 pb-20">
          <div className="container">
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-primary mb-8"
            >
              <ArrowLeft size={16} className="mr-2" />
              Retour
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>

                <div className="flex flex-wrap gap-4 mb-6">
                  <span className="inline-flex items-center gap-1 text-sm bg-secondary px-3 py-1 rounded-full">
                    <Calendar size={14} />
                    {formatDate(movie.releaseDate)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm bg-secondary px-3 py-1 rounded-full">
                    <Clock size={14} />
                    {movie.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm bg-secondary px-3 py-1 rounded-full">
                    <Users size={14} />
                    {movie.viewerCount.toLocaleString()} vues
                  </span>
                </div>

                <p className="text-lg mb-8">{movie.description}</p>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Catégorie</h3>
                    <Link
                      to={`/categories/${movie.category}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {movie.category}
                    </Link>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Date de sortie</h3>
                    <span className="text-sm">{formatDate(movie.releaseDate)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Prix</h3>
                    <span className="text-sm font-semibold">
                      {movie.isFree ? 'Gratuit' : formatCurrency(movie.price)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate(`/login?redirectTo=/movie/${movie.id}`);
                      } else if (movie.isFree || isPurchased) {
                        navigate(`/watch/${movie.id}`);
                      } else {
                        navigate(`/payment/${movie.id}`);
                      }
                    }}
                    className="btn btn-primary btn-lg flex-1"
                  >
                    <Play size={18} className="mr-2" />
                    Regarder
                  </button>


                  {!movie.isFree && !isPurchased && (
                    <Link
                      to={isAuthenticated ? `/payment/${movie.id}` : `/login?redirectTo=/payment/${movie.id}`}
                      className="btn btn-secondary btn-lg flex-1"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Acheter pour {formatCurrency(movie.price)}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}