import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, User, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract redirectTo from URL query params
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo') || '/';
  
  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    if (success) {
      navigate(redirectTo);
    }
  };
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Film className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Connexion</h2>
          <p className="mt-2 text-muted-foreground">
            Connectez-vous pour accéder à votre compte
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
                  placeholder="Votre adresse email"
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
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm">
                Se souvenir de moi
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-primary hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary hover:underline inline-flex items-center">
              Créer un compte <ArrowRight size={16} className="ml-1" />
            </Link>
          </p>
        </div>
        
        <div className="mt-6 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Pour les tests, utilisez : user@example.com / password
          </p>
        </div>
      </div>
    </div>
  );
}