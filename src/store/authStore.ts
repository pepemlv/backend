import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  getDoc
} from 'firebase/firestore';

type User = {
  id: string;
  fullname: string;
  email: string;
  city?: string;
  country?: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    fullname: string,
    email: string,
    password: string,
    city?: string,
    country?: string
  ) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      checkAuth: () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          set({ user: JSON.parse(storedUser), isAuthenticated: true });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const q = query(
            collection(db, 'pmsStreamingUsers'),
            where('email', '==', email),
            where('password', '==', password)
          );
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const docSnap = snapshot.docs[0];
            const data = docSnap.data();
            const user: User = {
              id: docSnap.id,
              fullname: data.fullname,
              email: data.email,
              city: data.city,
              country: data.country
            };
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, isAuthenticated: true, isLoading: false });
            toast.success('Connexion réussie');
            return true;
          } else {
            toast.error('Email ou mot de passe incorrect');
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          toast.error('Erreur lors de la connexion');
          set({ isLoading: false });
          return false;
        }
      },

      register: async (fullname, email, password, city, country) => {
        set({ isLoading: true });
        try {
          const q = query(collection(db, 'pmsStreamingUsers'), where('email', '==', email));
          const existing = await getDocs(q);
          if (!existing.empty) {
            toast.error('Email déjà utilisé');
            set({ isLoading: false });
            return false;
          }

          const newUser = {
            fullname,
            email,
            password,
            city,
            country
          };

          const docRef = await addDoc(collection(db, 'pmsStreamingUsers'), newUser);
          const user: User = {
            id: docRef.id,
            fullname,
            email,
            city,
            country
          };

          localStorage.setItem('user', JSON.stringify(user));
          set({ user, isAuthenticated: true, isLoading: false });
          toast.success('Inscription réussie');
          return true;
        } catch (error) {
          toast.error("Erreur lors de l'inscription");
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
        toast.success('Déconnexion réussie');
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);
