import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Youtube, Instagram, Twitter } from 'lucide-react';
import { useCreatorsStore } from '../store/creatorsStore';
import { useMoviesStore } from '../store/moviesStore';
import MovieCard from '../components/movies/MovieCard';

export default function CreatorPage() {
  const { id } = useParams<{ id: string }>();
  const { getCreatorById, fetchCreators } = useCreatorsStore();
  const { movies, fetchMovies, checkIfMovieIsPurchased } = useMoviesStore();
  const [creator, setCreator] = useState(null);
  const [creatorMovies, setCreatorMovies] = useState([]);

  useEffect(() => {
    fetchCreators();
    fetchMovies();
  }, [fetchCreators, fetchMovies]);

  useEffect(() => {
    if (id) {
      const foundCreator = getCreatorById(id);
      if (foundCreator) {
        setCreator(foundCreator);
        const linkedMovies = movies.filter(movie => 
          foundCreator.movieIds.includes(movie.id)
        );
        setCreatorMovies(linkedMovies);
      }
    }
  }, [id, getCreatorById, movies]);

  if (!creator) {
    return (
      <div className="container py-12">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-b from-background/50 to-background" />
        </div>

        <div className="container relative py-20">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-48 h-48 rounded-full overflow-hidden shrink-0">
              <img
                src={creator.image}
                alt={creator.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-4">{creator.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">
                {creator.bio}
              </p>

              <div className="flex flex-wrap gap-4">
                {creator.socialLinks.website && (
                  <a
                    href={creator.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Globe size={18} className="mr-2" />
                    Website
                  </a>
                )}
                {creator.socialLinks.youtube && (
                  <a
                    href={creator.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Youtube size={18} className="mr-2" />
                    YouTube
                  </a>
                )}
                {creator.socialLinks.instagram && (
                  <a
                    href={creator.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Instagram size={18} className="mr-2" />
                    Instagram
                  </a>
                )}
                {creator.socialLinks.twitter && (
                  <a
                    href={creator.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Twitter size={18} className="mr-2" />
                    Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Content by {creator.name}</h2>
          {creatorMovies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {creatorMovies.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isPurchased={checkIfMovieIsPurchased(movie.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No content available yet.
            </p>
          )}
        </div>

        {creator.storeUrl && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Creator Store</h2>
            <div className="bg-card rounded-lg p-6">
              <p className="text-lg mb-4">
                Support {creator.name} by checking out their merchandise!
              </p>
              <a
                href={creator.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                
                Visit Store
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}