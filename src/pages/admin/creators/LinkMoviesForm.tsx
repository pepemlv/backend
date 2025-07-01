import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCreatorsStore, Creator } from '../../../store/creatorsStore';
import { useMoviesStore } from '../../../store/moviesStore';
import toast from 'react-hot-toast';

type LinkMoviesFormProps = {
  creator: Creator;
  onClose: () => void;
};

export default function LinkMoviesForm({ creator, onClose }: LinkMoviesFormProps) {
  const { movies, fetchMovies } = useMoviesStore();
  const { linkMovieToCreator, unlinkMovieFromCreator } = useCreatorsStore();
  const [selectedMovies, setSelectedMovies] = useState<string[]>(creator.movieIds);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Remove unselected movies
      const moviesToRemove = creator.movieIds.filter(id => !selectedMovies.includes(id));
      for (const movieId of moviesToRemove) {
        await unlinkMovieFromCreator(creator.id, movieId);
      }

      // Add newly selected movies
      const moviesToAdd = selectedMovies.filter(id => !creator.movieIds.includes(id));
      for (const movieId of moviesToAdd) {
        await linkMovieToCreator(creator.id, movieId);
      }

      toast.success('Movies updated successfully');
      onClose();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const toggleMovie = (movieId: string) => {
    setSelectedMovies(prev =>
      prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-lg w-full max-w-2xl">
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h2 className="text-xl font-semibold">
              Link Movies to {creator.name}
            </h2>
            <button onClick={onClose} className="btn btn-ghost btn-sm">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Select the movies that belong to this creator
              </p>

              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                {movies.map(movie => (
                  <label
                    key={movie.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMovies.includes(movie.id)}
                      onChange={() => toggleMovie(movie.id)}
                      className="rounded border-gray-300"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{movie.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {movie.category}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}