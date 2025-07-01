import { useEffect, useState } from 'react';
import { useMoviesStore, Movie } from '../../store/moviesStore';
import MovieCard from './MovieCard';
import { Film } from 'lucide-react';

type CategoryMoviesProps = {
  category: string;
};

export default function CategoryMovies({ category }: CategoryMoviesProps) {
  const { movies, fetchMovies, isLoading, checkIfMovieIsPurchased } = useMoviesStore();
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);
  
  useEffect(() => {
    if (movies.length > 0) {
      if (category === 'all') {
        setFilteredMovies(movies);
      } else {
        setFilteredMovies(movies.filter(movie => movie.category === category));
      }
    }
  }, [movies, category]);
  
  if (isLoading && filteredMovies.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-secondary animate-pulse rounded-lg aspect-[2/3]"></div>
        ))}
      </div>
    );
  }
  
  if (filteredMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Film size={48} className="text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Aucun film dans cette catégorie</h3>
        <p className="text-muted-foreground max-w-md">
          Nous n'avons pas de films dans cette catégorie pour le moment. Revenez plus tard !
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {filteredMovies.map(movie => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          isPurchased={checkIfMovieIsPurchased(movie.id)}
        />
      ))}
    </div>
  );
}