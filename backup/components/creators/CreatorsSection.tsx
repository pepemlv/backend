import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { useCreatorsStore } from '../../store/creatorsStore';
import CreatorCard from './CreatorCard';

export default function CreatorsSection() {
  const { creators, fetchCreators } = useCreatorsStore();

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Créateurs en vedette</h2>
            <p className="text-muted-foreground">
              Découvrez des créateurs de contenu talentueux et leurs contenus exclusifs
            </p>
          </div>
          <Link to="/creators" className="text-primary hover:underline">
            Voir tous les créateurs
          </Link>
        </div>

        {creators.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {creators.map(creator => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserCircle size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Aucun créateur pour le moment</h3>
            <p className="text-muted-foreground">
              Revenez bientôt pour découvrir des créateurs en vedette !
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
