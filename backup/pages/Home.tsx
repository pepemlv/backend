import { useEffect } from 'react';
import { Film, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMoviesStore } from '../store/moviesStore';
import FeaturedMovies from '../components/movies/FeaturedMovies';
import CreatorsSection from '../components/creators/CreatorsSection';

// Section principale
function Hero() {
  const { movies, fetchMovies } = useMoviesStore();

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const heroMovie = movies.length > 0 
    ? movies.find(movie => !movie.isFree) || movies[0]
    : null;

  return (
    <section className="relative">
      {heroMovie ? (
        <>
          <div className="absolute inset-0">
            <img 
              src={heroMovie.image} 
              alt={heroMovie.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          </div>
          <div className="relative min-h-[50vh] flex items-center">
            <div className="container py-20">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {heroMovie.title}
                </h1>
                <p className="text-lg text-gray-200 mb-6">
                  {heroMovie.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to={`/movie/${heroMovie.id}`} className="btn btn-primary btn-lg">
                    <Play size={18} className="mr-2" />
                    Voir les détails
                  </Link>
                  {!heroMovie.isFree && (
                    <Link to={`/movie/${heroMovie.id}`} className="btn btn-secondary btn-lg">
                      Acheter maintenant
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-background/50 to-background">
          <div className="text-center">
            <Film size={64} className="mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold mb-4">PMStreaming</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Votre plateforme de streaming préférée
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

// Section "Comment ça marche"
function HowItWorks() {
  const steps = [
    {
      title: "Créer un compte",
      description: "Créez votre compte en quelques clics"
    },
    {
      title: "Choisir un contenu",
      description: "Parcourez notre catalogue varié"
    },
    {
      title: "Paiement facile",
      description: "Utilisez Mobile Money ou carte bancaire"
    },
    {
      title: "Profitez-en",
      description: "Regardez vos contenus où et quand vous voulez"
    }
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
          <p className="text-muted-foreground">Simple, rapide et sécurisé</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section des catégories
function Categories() {
  const categories = [
    'Action',
    'Fantastique',
    'Documentaire',
    'Musique',
    'Éducation'
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos catégories</h2>
          <p className="text-muted-foreground">Découvrez des contenus pour tous les goûts</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(category => (
            <Link 
              key={category}
              to={`/categories/${category}`}
              className="bg-card hover:bg-primary/10 transition-colors rounded-lg p-6 text-center"
            >
              <h3 className="text-lg font-medium">{category}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section d'appel à l'action
function CallToAction() {
  return (
    <section className="py-16 bg-primary/10">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Rejoignez PMStreaming dès aujourd'hui
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Accédez à des milliers de films et d'événements en direct. Inscrivez-vous maintenant !
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn btn-primary btn-lg">
              S'inscrire
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedMovies />
      <CreatorsSection />
      <HowItWorks />
      <Categories />
      <CallToAction />
    </div>
  );
}
