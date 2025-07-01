'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { X } from 'lucide-react';
import './MovieForm.css'

type Props = {
  onClose: () => void;
};

export default function MovieForm({ onClose }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    releaseDate: '',
    price: 0,
    isFree: false,
    isLive: false,
    isStreaming: false,
    venue: '',
    creator: '',
    viewerCount: 0,
    muxUrl: '', // pasted URL from Mux
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const extractPlaybackId = (url: string): string | null => {
    // Extract the playbackId from mux.com URL
    const match = url.match(/mux\.com\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const playbackId = extractPlaybackId(formData.muxUrl);

    if (!formData.title || !formData.description || !playbackId) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const newMovie = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      duration: formData.duration,
      releaseDate: formData.releaseDate,
      price: Number(formData.price),
      isFree: formData.isFree,
      isLive: formData.isLive,
      isStreaming: formData.isStreaming,
      venue: formData.venue,
      creator: formData.creator,
      viewerCount: Number(formData.viewerCount),
      playbackId,
      image: `https://image.mux.com/${playbackId}/thumbnail.jpg`,
      videoUrl: `https://stream.mux.com/${playbackId}.m3u8`,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, 'movies'), newMovie);
      toast.success('Film ajouté avec succès !');
      onClose();
    } catch (error) {
      console.error('Erreur Firestore:', error);
      toast.error('Erreur lors de l’ajout du film.');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded shadow relative">
      <button onClick={onClose} className="absolute top-2 right-2">
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-xl font-bold mb-4">Ajouter un nouveau film</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Catégorie"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="duration"
          placeholder="Durée (ex: 1h 30min)"
          value={formData.duration}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="releaseDate"
          value={formData.releaseDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Prix"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFree"
            checked={formData.isFree}
            onChange={handleChange}
          />
          Gratuit
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isLive"
            checked={formData.isLive}
            onChange={handleChange}
          />
          Live
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isStreaming"
            checked={formData.isStreaming}
            onChange={handleChange}
          />
          En streaming
        </label>
        <input
          type="text"
          name="venue"
          placeholder="Lieu"
          value={formData.venue}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="creator"
          placeholder="Créateur"
          value={formData.creator}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="viewerCount"
          placeholder="Nombre de vues"
          value={formData.viewerCount}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="muxUrl"
          placeholder="URL de lecture Mux"
          value={formData.muxUrl}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Ajouter le film
        </button>
      </form>
    </div>
  );
}
