import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import {
  Calendar, Users, Clock, Play, ShoppingCart,
  Video, MapPin, User, Radio
} from 'lucide-react';
import { useMoviesStore } from '../../store/moviesStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, formatDate } from '../../lib/utils';
import '../../styles/components/movies/FeaturedMovies.css';

export default function FeaturedMovies() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const liveScrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // We keep these stores for usage inside MoviePlayer; no checks here.
  const { checkIfMovieIsPurchased } = useMoviesStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'movies'));
        const moviesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMovies(moviesData);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const scroll = () => {
      const container = scrollRef.current;
      if (!container) return;
      container.scrollLeft += 1;
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
    };

    if (!isPaused) {
      const interval = setInterval(scroll, 20);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const duplicatedMovies = [...movies, ...movies];
  const liveEvents = movies.filter(m => m.isLive);
  const currentLiveEvent = liveEvents.find(m => m.isStreaming);

  const handleScroll = (dir: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = dir === 'left' ? -container.offsetWidth : container.offsetWidth;
    container.scrollLeft += amount;
  };

  const handleLiveScroll = (dir: 'left' | 'right') => {
    const container = liveScrollRef.current;
    if (!container) return;
    const amount = dir === 'left' ? -container.offsetWidth : container.offsetWidth;
    container.scrollLeft += amount;
  };

  if (loading) return <div>Loading movies...</div>;

  return (
    <>
      {currentLiveEvent && (
        <section className="live-now-banner">
          <div className="container">
            <div className="live-now-content">
              <div className="live-badge-large">
                <Radio className="animate-pulse" size={20} />
                <span>{currentLiveEvent.title} - En direct maintenant</span>
              </div>

              <div className="live-now-grid">
                <div className="live-now-preview">
                  <video
                    controls
                    autoPlay
                    className="live-now-video"
                    src={currentLiveEvent.videoUrl}
                  />
                </div>

                <div className="live-now-info">
                  <h2 className="live-now-title">{currentLiveEvent.title}</h2>
                  <p className="live-now-desc">{currentLiveEvent.description}</p>

                  <div className="live-now-meta">
                    <div className="live-now-stat"><User size={18} /><span>{currentLiveEvent.creator}</span></div>
                    <div className="live-now-stat"><MapPin size={18} /><span>{currentLiveEvent.venue}</span></div>
                    <div className="live-now-stat"><Users size={18} /><span>{currentLiveEvent.viewerCount.toLocaleString()} spectateurs</span></div>
                  </div>

                  <div className="live-now-actions">
                    {/* Always navigate to movie details */}
                    <Link
                      to={`/movie/${currentLiveEvent.id}`}
                      className="btn btn-primary btn-lg"
                    >
                      <Play size={20} />
                      Voir détails
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Videos */}
      <section className="feat">
        <div className="wrap">
          <div className="feat-head">
            <div>
              <h2 className="feat-title">Vidéos disponibles</h2>
              <p className="feat-sub">Sélectionnez une vidéo à visionner ou à acquérir</p>
            </div>
            <Link to="/categories/all" className="feat-link">Voir toutes les vidéos</Link>
          </div>

          <div
            className="feat-wrap"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div ref={scrollRef} className="feat-scroll">
              {duplicatedMovies.map((movie, index) => {
                return (
                  <div key={`${movie.id}-${index}`} className="feat-item">
                    <div
                      className="card"
                      onClick={() => {
                        navigate(`/movie/${movie.id}`); // Always to details page
                      }}
                    >
                      <div className="feat-thumb">
                        <img src={movie.image} alt={movie.title} className="img-cover" />
                        <div className="overlay p4">
                          <div className="flex gap-2 mb2">
                            {movie.isLive && <span className="badge bg-red">EN DIRECT</span>}
                            {movie.isFree && <span className="badge bg-green">GRATUIT</span>}
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to={`/movie/${movie.id}`}
                              className="btn btn-pri flex-1 center gap-1"
                              onClick={e => e.stopPropagation()}
                            >
                              <Play size={16} />
                              <span>Voir détails</span>
                            </Link>
                          </div>
                        </div>
                        {!movie.isFree && (
                          <div className="badge abs top-2 right-2 bg-dark">
                            {formatCurrency(movie.price)}
                          </div>
                        )}
                      </div>
                      <div className="feat-info">
                        <h3 className="feat-name">{movie.title}</h3>
                        <p className="feat-cat">{movie.category}</p>
                        <div className="feat-stats">
                          <div className="feat-stat"><Clock size={14} /><span>{movie.duration}</span></div>
                          <div className="feat-stat"><Users size={14} /><span>{movie.viewerCount.toLocaleString()}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => handleScroll("left")} className="feat-nav feat-prev">←</button>
            <button onClick={() => handleScroll("right")} className="feat-nav feat-next">→</button>
          </div>
        </div>
      </section>

      {/* Upcoming Live Events */}
      {liveEvents.length > 0 && (
        <section className="feat bg-sec">
          <div className="wrap">
            <div className="feat-head">
              <div>
                <h2 className="feat-title">
                  <Video className="inline-block mr2" size={24} />
                  Prochains événements en direct
                </h2>
                <p className="feat-sub">Ne manquez pas nos prochains événements en direct</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleLiveScroll("left")} className="btn btn-outline">←</button>
                <button onClick={() => handleLiveScroll("right")} className="btn btn-outline">→</button>
              </div>
            </div>

            <div className="feat-scroll" ref={liveScrollRef}>
              {liveEvents.map(event => (
                <div key={event.id} className="live-card">
                  <div className="live-thumb">
                    <img src={event.image} alt={event.title} className="img-cover" />
                    {event.isStreaming && (
                      <span className="badge bg-red absolute top-2 left-2">EN DIRECT</span>
                    )}
                  </div>

                  <div className="live-info">
                    <h3 className="live-title">{event.title}</h3>
                    <p className="live-desc">{event.description}</p>

                    <div className="live-meta">
                      <div className="live-meta-item"><Calendar size={16} /><span>{formatDate(event.releaseDate)}</span></div>
                      <div className="live-meta-item"><MapPin size={16} /><span>{event.venue || 'En ligne'}</span></div>
                      <div className="live-meta-item"><User size={16} /><span>{event.creator || 'Organisateur'}</span></div>
                    </div>

                    <div className="live-actions">
                      {/* Always navigate to movie details */}
                      <Link
                        to={`/movie/${event.id}`}
                        className="btn btn-primary"
                      >
                        <Play size={16} />
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
