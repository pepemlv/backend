import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Save, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  
  const [name, setName] = useState(user?.fullname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("Utilisateur non valide");
      return;
    }

    try {
      const userRef = doc(db, 'pmsStreamingUsers', user.id);
      await updateDoc(userRef, {
        fullname: name,
        email,
        phone
      });

      // Optionally update local state/store
      const updatedUser = { ...user, fullname: name, email, phone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error(error);
    }
  };

  return (
    <div className="container py-12">
      <Link 
        to="/" 
        className="inline-flex items-center text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft size={16} className="mr-2" />
        Retour à l'accueil
      </Link>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
        
        <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Informations personnelles</h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-sm btn-outline"
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="name"
                  type="text"
                  className="input pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="input pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  className="input pl-10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Utilisé pour les paiements Mobile Money
              </p>
            </div>
            
            {isEditing && (
              <button 
                onClick={handleSave}
                className="btn btn-primary w-full"
              >
                <Save size={16} className="mr-2" />
                Enregistrer les modifications
              </button>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <Link to="/my-library" className="btn btn-outline w-full">
            Gérer mes achats
          </Link>
          
          <button 
            onClick={logout}
            className="btn btn-destructive w-full"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
