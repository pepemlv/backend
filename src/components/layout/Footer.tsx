import { Link } from 'react-router-dom';
import { Film, Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Film className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">
                PMS<span className="text-primary">treaming</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Votre plateforme de streaming préférée avec les meilleurs films et événements en direct.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/categories/all" className="text-muted-foreground hover:text-primary transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link to="/my-library" className="text-muted-foreground hover:text-primary transition-colors">
                  Ma Bibliothèque
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">
                  Inscription
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categories/Action" className="text-muted-foreground hover:text-primary transition-colors">
                  Action
                </Link>
              </li>
              <li>
                <Link to="/categories/Fantastique" className="text-muted-foreground hover:text-primary transition-colors">
                  Fantastique
                </Link>
              </li>
              <li>
                <Link to="/categories/Documentaire" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentaire
                </Link>
              </li>
              <li>
                <Link to="/categories/Musique" className="text-muted-foreground hover:text-primary transition-colors">
                  Musique
                </Link>
              </li>
              <li>
                <Link to="/categories/Éducation" className="text-muted-foreground hover:text-primary transition-colors">
                  Éducation
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">support@pmstreaming.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">+243 123 456 789</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-6 flex justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PMStreaming. Tous droits réservés.</p>
          <Link to="/admin/login" className="hover:text-primary transition-colors">
            Administration
          </Link>
        </div>
      </div>
    </footer>
  );
}