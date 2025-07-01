import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Film, User, Lock, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock admin authentication - replace with real admin auth
      if (email === 'admin@pmstreaming.com' && password === 'admin123') {
        localStorage.setItem('adminToken', 'mock-admin-token');
        toast.success('Connexion réussie');
        navigate('/admin/dashboard');
      } else {
        toast.error('Email ou mot de passe invalide');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block mb-8 text-muted-foreground hover:text-primary">
            <ArrowLeft size={20} className="inline-block mr-2" />
            Retour au site
          </Link>
          <div className="flex justify-center mb-4">
            <Film className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Administration</h2>
          <p className="mt-2 text-muted-foreground">
            Connectez-vous à votre compte administrateur
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input pl-10"
                  placeholder="Email administrateur"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input pl-10"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Pour les tests, utilisez : admin@pmstreaming.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}