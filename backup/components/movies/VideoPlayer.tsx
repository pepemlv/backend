import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MuxPlayer from '@mux/mux-player-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Adjust this import to your Firebase config path

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<{
    playbackId: string;
    title: string;
    isLive?: boolean;
  } | null>(null);

  useEffect(() => {
    async function fetchMovie() {
      if (!id) return;

      try {
        const docRef = doc(db, 'movies', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setMovie({
            playbackId: data.playbackId,
            title: data.title,
            isLive: data.isLive,
          });
        } else {
          console.warn('No movie found with id:', id);
          setMovie(null);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
        setMovie(null);
      }
    }

    fetchMovie();
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="aspect-video w-full bg-black">
      <MuxPlayer
        streamType={movie.isLive ? 'live' : 'on-demand'}
        playbackId={movie.playbackId}
        autoPlay
        className="w-full h-full"
        metadata={{
          video_id: id,
          video_title: movie.title,
          viewer_user_id: 'anonymous', // Replace with actual user ID if authenticated
        }}
        title={movie.title}
      />
    </div>
  );
}
