import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Film } from 'lucide-react';
import CategoryMovies from '../components/movies/CategoryMovies';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [categoryTitle, setCategoryTitle] = useState('');
  
  useEffect(() => {
    if (category) {
      if (category === 'all') {
        setCategoryTitle('Toutes les catégories');
      } else {
        setCategoryTitle(category);
      }
    }
  }, [category]);
  
  return (
    <div className="container py-12">
      <Link 
        to="/" 
        className="inline-flex items-center text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft size={16} className="mr-2" />
        Retour à l'accueil
      </Link>
      
      <div className="flex items-center gap-3 mb-8">
        <Film size={32} className="text-primary" />
        <h1 className="text-3xl font-bold">{categoryTitle}</h1>
      </div>
      
      <CategoryMovies category={category || 'all'} />
    </div>
  );
}