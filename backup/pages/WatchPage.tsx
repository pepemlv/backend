// src/pages/WatchPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MuxPlayer from '@mux/mux-player-react';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { Movie } from '../store/moviesStore';

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [canWatch, setCanWatch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirectTo=/watch/${id}`);
      return;
    }

    const checkAccess = async () => {
      try {
        if (!id || !user?.id) return navigate('/');

        const movieRef = doc(db, 'movies', id);
        const movieSnap = await getDoc(movieRef);

        if (!movieSnap.exists()) return navigate('/');

        const movieData = { ...movieSnap.data(), id: movieSnap.id } as Movie;
        setMovie(movieData);

        if (movieData.isFree || movieData.purchasers?.includes(user.id)) {
          setCanWatch(true);
          return;
        }

        const q = query(
          collection(db, 'purchasedMovies'),
          where('userId', '==', user.id),
          where('movieId', '==', id)
        );
        const result = await getDocs(q);

        if (!result.empty) {
          setCanWatch(true);
        } else {
          navigate(`/payment/${id}`);
        }
      } catch (err) {
        console.error('Error:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [id, isAuthenticated, user, navigate]);

  if (loading || !movie) {
    return (
      <div className="container py-20 text-center">
        <p>Chargement de la vidéo...</p>
      </div>
    );
  }

  if (!canWatch) {
    return (
      <div className="container py-20 text-center">
        <p>Vous n'avez pas accès à ce film.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>

      <div className="aspect-video w-full bg-black">
        <MuxPlayer
          streamType={movie.isLive ? 'live' : 'on-demand'}
          playbackId={movie.playbackId}
          autoPlay
          className="w-full h-full"
          metadata={{
            video_id: id!,
            video_title: movie.title,
            viewer_user_id: user?.id || 'anonymous',
          }}
          title={movie.title}
        />
      </div>
    </div>
  );
}
