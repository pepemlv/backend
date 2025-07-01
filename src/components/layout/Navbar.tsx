import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Bell, User, Calendar, Film, BarChart2, Library } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navLinks = [
    { to: '/', label: 'Accueil', icon: <Calendar size={18} /> },
    { to: '/categories/all', label: 'Catégories', icon: <BarChart2 size={18} /> },
    { to: '/my-library', label: 'Ma Bibliothèque', icon: <Library size={18} />, auth: true }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-gradient-to-b from-background/80 to-transparent"
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Film className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">
              PMS<span className="text-primary">treaming</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.filter(link => !link.auth || (link.auth && isAuthenticated)).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="input h-9 pl-9 w-[200px] bg-secondary"
              />
            </div>
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-full bg-secondary p-2 text-sm font-medium"
                >
                  <User size={18} />
                  <span className="hidden lg:inline">{user?.name}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm hover:bg-secondary"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Mon Profil
                      </Link>
                      <Link 
                        to="/my-library" 
                        className="block px-4 py-2 text-sm hover:bg-secondary"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Mes Achats
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                <User size={18} className="mr-2" />
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-card rounded-lg shadow-lg fadeIn">
            <nav className="flex flex-col space-y-4 px-4">
              {navLinks.filter(link => !link.auth || (link.auth && isAuthenticated)).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md",
                    location.pathname === link.to 
                      ? "bg-primary/20 text-primary" 
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              
              <div className="relative my-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="search"
                  placeholder="Rechercher..."
                  className="input h-10 pl-9 w-full bg-secondary"
                />
              </div>
              
              {isAuthenticated ? (
                <div className="border-t border-border pt-4 mt-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary rounded-full p-2">
                      <User size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Mon Profil</span>
                  </Link>
                  
                  <Link 
                    to="/my-library" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Library size={18} />
                    <span>Mes Achats</span>
                  </Link>
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left p-2 rounded-md text-destructive hover:bg-secondary mt-2"
                  >
                    <X size={18} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="btn btn-primary w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="mr-2" />
                  Connexion
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}