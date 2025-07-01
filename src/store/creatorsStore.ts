import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { generateRandomId } from '../lib/utils';

export type Creator = {
  id: string;
  name: string;
  bio: string;
  image: string;
  socialLinks: {
    website?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
  storeUrl?: string;
  joinDate: string;
  movieIds: string[];
};

type CreatorsState = {
  creators: Creator[];
  isLoading: boolean;
  fetchCreators: () => Promise<void>;
  getCreatorById: (id: string) => Creator | undefined;
  addCreator: (creatorData: Omit<Creator, 'id' | 'joinDate' | 'movieIds'>) => Promise<Creator>;
  updateCreator: (id: string, creatorData: Partial<Creator>) => Promise<void>;
  deleteCreator: (id: string) => Promise<void>;
  linkMovieToCreator: (creatorId: string, movieId: string) => Promise<void>;
  unlinkMovieFromCreator: (creatorId: string, movieId: string) => Promise<void>;
};

// Initial creators data for testing
const initialCreators: Creator[] = [
  {
    id: '1',
    name: 'John Creator',
    bio: 'Filmmaker and content creator specializing in action movies.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    socialLinks: {
      youtube: 'https://youtube.com/johncreator',
      instagram: 'https://instagram.com/johncreator',
    },
    storeUrl: 'https://printify.com/store/johncreator',
    joinDate: '2023-01-15',
    movieIds: ['1', '2']
  }
];

export const useCreatorsStore = create<CreatorsState>()(
  persist(
    (set, get) => ({
      creators: initialCreators,
      isLoading: false,

      fetchCreators: async () => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // If creators are already loaded, don't reset them
          if (get().creators.length === 0) {
            set({ creators: initialCreators });
          }
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Error fetching creators:', error);
          toast.error('Error loading creators');
          set({ isLoading: false });
        }
      },

      getCreatorById: (id) => {
        return get().creators.find(creator => creator.id === id);
      },

      addCreator: async (creatorData) => {
        set({ isLoading: true });
        try {
          const newCreator: Creator = {
            ...creatorData,
            id: generateRandomId(),
            joinDate: new Date().toISOString(),
            movieIds: []
          };

          set(state => ({
            creators: [...state.creators, newCreator],
            isLoading: false
          }));

          toast.success('Creator added successfully');
          return newCreator;
        } catch (error) {
          console.error('Error adding creator:', error);
          toast.error('Error adding creator');
          set({ isLoading: false });
          throw error;
        }
      },

      updateCreator: async (id, creatorData) => {
        set({ isLoading: true });
        try {
          set(state => ({
            creators: state.creators.map(creator =>
              creator.id === id
                ? { ...creator, ...creatorData }
                : creator
            ),
            isLoading: false
          }));

          toast.success('Creator updated successfully');
        } catch (error) {
          console.error('Error updating creator:', error);
          toast.error('Error updating creator');
          set({ isLoading: false });
          throw error;
        }
      },

      deleteCreator: async (id) => {
        set({ isLoading: true });
        try {
          set(state => ({
            creators: state.creators.filter(creator => creator.id !== id),
            isLoading: false
          }));

          toast.success('Creator deleted successfully');
        } catch (error) {
          console.error('Error deleting creator:', error);
          toast.error('Error deleting creator');
          set({ isLoading: false });
          throw error;
        }
      },

      linkMovieToCreator: async (creatorId, movieId) => {
        try {
          set(state => ({
            creators: state.creators.map(creator =>
              creator.id === creatorId && !creator.movieIds.includes(movieId)
                ? { ...creator, movieIds: [...creator.movieIds, movieId] }
                : creator
            )
          }));

          toast.success('Movie linked to creator');
        } catch (error) {
          console.error('Error linking movie:', error);
          toast.error('Error linking movie to creator');
          throw error;
        }
      },

      unlinkMovieFromCreator: async (creatorId, movieId) => {
        try {
          set(state => ({
            creators: state.creators.map(creator =>
              creator.id === creatorId
                ? { ...creator, movieIds: creator.movieIds.filter(id => id !== movieId) }
                : creator
            )
          }));

          toast.success('Movie unlinked from creator');
        } catch (error) {
          console.error('Error unlinking movie:', error);
          toast.error('Error unlinking movie from creator');
          throw error;
        }
      }
    }),
    {
      name: 'creators-storage',
      partialize: (state) => ({ creators: state.creators }),
    }
  )
);