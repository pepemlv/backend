import { create } from 'zustand';
import toast from 'react-hot-toast';
import { generateRandomId } from '../lib/utils';
import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { useAuthStore } from './authStore'; // make sure this returns current `user`

export type Movie = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  isFree: boolean;
  category: string;
  duration: string;
  releaseDate: string;
  viewerCount: number;
  isLive?: boolean;
  isStreaming?: boolean;
  videoUrl: string;
  venue?: string;
  creator?: string;
  playbackId: string;
};

type PurchasedMovie = {
  movieId: string;
  purchaseDate: string;
  transactionId: string;
  amount: number;
};

type MoviesState = {
  movies: Movie[];
  purchasedMovies: PurchasedMovie[];
  isLoading: boolean;
  fetchMovies: () => Promise<void>;
  fetchPurchasedMovies: () => Promise<void>;
  getMovieById: (id: string) => Movie | undefined;
  getMoviesByCategory: (category: string) => Movie[];
  getPurchasedMovies: () => { movie: Movie; purchaseDate: string; amount: number }[];
  purchaseMovie: (movieId: string, paymentData: any) => Promise<{ success: boolean; transactionId?: string }>;
  checkIfMovieIsPurchased: (movieId: string) => boolean;
};

export const useMoviesStore = create<MoviesState>((set, get) => ({
  movies: [],
  purchasedMovies: [],
  isLoading: false,

  fetchMovies: async () => {
    set({ isLoading: true });
    try {
      const snapshot = await getDocs(collection(db, 'movies'));
      const movies: Movie[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Movie, 'id'>),
      }));
      set({ movies, isLoading: false });
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Erreur lors du chargement des films');
      set({ isLoading: false });
    }
  },

  fetchPurchasedMovies: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const q = query(
        collection(db, 'purchasedMovies'),
        where('userId', '==', user.id)
      );
      const snapshot = await getDocs(q);

      const purchased: PurchasedMovie[] = snapshot.docs.map(doc => ({
        movieId: doc.data().movieId,
        purchaseDate: doc.data().purchaseDate,
        transactionId: doc.data().transactionId,
        amount: doc.data().amount,
      }));

      set({ purchasedMovies: purchased });
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Erreur lors du chargement des achats');
    }
  },

  getMovieById: (id) => get().movies.find(m => m.id === id),

  getMoviesByCategory: (category) =>
    get().movies.filter(movie => movie.category === category),

  getPurchasedMovies: () => {
    const { movies, purchasedMovies } = get();
    return purchasedMovies
      .map(p => {
        const movie = movies.find(m => m.id === p.movieId);
        return movie
          ? {
              movie,
              purchaseDate: p.purchaseDate,
              amount: p.amount,
            }
          : null;
      })
      .filter((item): item is { movie: Movie; purchaseDate: string; amount: number } => !!item);
  },

  purchaseMovie: async (movieId, paymentData) => {
    set({ isLoading: true });
    const { user } = useAuthStore.getState();
    if (!user) {
      toast.error('Utilisateur non connecté');
      set({ isLoading: false });
      return { success: false };
    }

    try {
      const movie = get().movies.find(m => m.id === movieId);
      if (!movie) {
        toast.error('Film non trouvé');
        set({ isLoading: false });
        return { success: false };
      }

      const amount = Number(movie.price.toFixed(2));
      const transactionId = generateRandomId();
      const purchaseDate = new Date().toISOString();

      const newPurchase: PurchasedMovie = {
        movieId,
        purchaseDate,
        transactionId,
        amount,
      };

      await addDoc(collection(db, 'purchasedMovies'), {
        userId: user.id,
        ...newPurchase,
      });

      set(state => ({
        purchasedMovies: [...state.purchasedMovies, newPurchase],
        isLoading: false,
      }));

      toast.success(`Achat réussi ! Montant payé : ${amount.toFixed(2)}$`);
      return { success: true, transactionId };
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erreur lors du paiement');
      set({ isLoading: false });
      return { success: false };
    }
  },

  checkIfMovieIsPurchased: (movieId) => {
    const movie = get().movies.find(m => m.id === movieId);
    if (movie?.isFree) return true;

    return get().purchasedMovies.some(p => p.movieId === movieId);
  },
}));
