import { Link } from 'react-router-dom';
import { Youtube, Instagram, Twitter } from 'lucide-react';
import { Creator } from '../../store/creatorsStore';

type CreatorCardProps = {
  creator: Creator;
};

export default function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <div className="group relative">
      <Link to={`/creator/${creator.id}`} className="block">
        <div className="aspect-square rounded-xl overflow-hidden mb-4">
          <img
            src={creator.image}
            alt={creator.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        <h3 className="text-lg font-semibold mb-1">{creator.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {creator.bio}
        </p>
        
        <div className="flex gap-3">
          {creator.socialLinks.youtube && (
            <a
              href={creator.socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Youtube size={18} />
            </a>
          )}
          {creator.socialLinks.instagram && (
            <a
              href={creator.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Instagram size={18} />
            </a>
          )}
          {creator.socialLinks.twitter && (
            <a
              href={creator.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Twitter size={18} />
            </a>
          )}
        </div>
      </Link>
    </div>
  );
}