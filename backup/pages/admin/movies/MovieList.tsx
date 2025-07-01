import { useState } from 'react';
import { Film, Edit, Trash, Plus, Search } from 'lucide-react';
import { useMoviesStore } from '../../../store/moviesStore';
import { formatCurrency, formatDate } from '../../../lib/utils';
import MovieForm from './MovieForm';

export default function MovieList() {
  const { movies, deleteMovie } = useMoviesStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setIsFormOpen(true);
  };

  const handleDelete = async (movieId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      await deleteMovie(movieId);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Films</h1>
        <button
          onClick={() => {
            setEditingMovie(null);
            setIsFormOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} className="mr-2" />
          Ajouter un film
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="search"
            placeholder="Rechercher un film..."
            className="input pl-10 w-full max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4">Film</th>
                <th className="text-left p-4">Catégorie</th>
                <th className="text-left p-4">Prix</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Vues</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="border-b border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded overflow-hidden">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{movie.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {movie.duration}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{movie.category}</td>
                  <td className="p-4">
                    {movie.isFree ? (
                      <span className="text-green-500">Gratuit</span>
                    ) : (
                      formatCurrency(movie.price)
                    )}
                  </td>
                  <td className="p-4">{formatDate(movie.releaseDate)}</td>
                  <td className="p-4">{movie.viewerCount.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleEdit(movie)}
                      className="btn btn-ghost btn-sm mr-2"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="btn btn-ghost btn-sm text-destructive"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <MovieForm
          movie={editingMovie}
          onClose={() => {
            setIsFormOpen(false);
            setEditingMovie(null);
          }}
        />
      )}
    </div>
  );
}