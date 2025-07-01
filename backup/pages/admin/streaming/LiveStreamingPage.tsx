import { useState, useRef, useEffect } from 'react';
import { Video, Play, Pause, Settings, Users, Eye, Save } from 'lucide-react';
import { useMoviesStore, Movie } from '../../../store/moviesStore';
import toast from 'react-hot-toast';
import { generateRandomId } from '../../../lib/utils';

export default function LiveStreamingPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [creator, setCreator] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { movies, setMovies } = useMoviesStore();

  // Get current live events
  const liveEvents = movies.filter(movie => movie.isLive);
  const currentStream = liveEvents.find(event => event.isStreaming);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      // Create new live event
      const newLiveEvent: Movie = {
        id: generateRandomId(),
        title,
        description,
        image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
        price: isFree ? 0 : price,
        isFree,
        category: 'Live Event',
        duration: 'Live',
        releaseDate: new Date().toISOString(),
        viewerCount: 0,
        isLive: true,
        isStreaming: true,
        videoUrl: 'https://www.youtube.com/watch?v=live',
        venue,
        creator
      };

      // Add new live event to movies store
      setMovies([...movies, newLiveEvent]);
      
      setIsStreaming(true);
      toast.success('Stream started successfully');
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera');
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Update movies to mark current stream as ended
    setMovies(movies.map(movie => 
      movie.isStreaming ? { ...movie, isStreaming: false } : movie
    ));
    
    setIsStreaming(false);
    toast.success('Stream stopped');
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Live Streaming</h1>
          <p className="text-muted-foreground">Manage and monitor live events</p>
        </div>
        
        <button
          onClick={isStreaming ? stopStream : startStream}
          className={`btn ${isStreaming ? 'btn-destructive' : 'btn-primary'}`}
        >
          {isStreaming ? (
            <>
              <Pause size={18} className="mr-2" />
              Stop Stream
            </>
          ) : (
            <>
              <Play size={18} className="mr-2" />
              Start Stream
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stream Preview */}
        <div className="bg-card rounded-lg overflow-hidden">
          <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
            {!isStreaming && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Video size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Camera preview will appear here</p>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full"
            />
          </div>

          {isStreaming && (
            <div className="p-4 bg-secondary/50 mt-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                    LIVE
                  </span>
                  <span className="text-sm text-muted-foreground">00:12:34</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">234</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">156</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stream Settings */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Stream Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter stream title"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your stream"
                  className="input w-full"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Enter venue name"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Creator/Host</label>
                <input
                  type="text"
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  placeholder="Enter creator or host name"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span>Free Stream</span>
                </label>
              </div>

              {!isFree && (
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="input w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-lg p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Settings size={18} />
              Stream Info
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Server: rtmp://streaming.pmstreaming.com/live</p>
              <p>Stream Key: live_xxxxxxxxxxx</p>
              <p className="text-xs mt-4">
                Use these credentials in your streaming software (OBS, Streamlabs, etc.)
              </p>
            </div>
          </div>

          <button 
            className="btn btn-primary w-full"
            onClick={() => toast.success('Stream settings saved')}
          >
            <Save size={18} className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>

      {/* Current Live Events */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Current Live Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveEvents.map(event => (
            <div key={event.id} className="bg-card rounded-lg overflow-hidden">
              <div className="aspect-video">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {event.isStreaming && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                      LIVE NOW
                    </span>
                  )}
                  {event.isFree && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                      FREE
                    </span>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users size={14} />
                    {event.viewerCount.toLocaleString()}
                  </div>
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      // Handle edit event
                      toast.success('Edit event settings');
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}