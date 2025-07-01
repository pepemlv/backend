import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

type MovieCardProps = {
  id: string;
  title: string;
  image: string;
  category?: string;
  duration?: string;
  viewerCount?: number;
  price?: number;
  isFree?: boolean;
  isLive?: boolean;
  onClick?: () => void;
};

export default function MovieCard({
  id,
  title,
  image,
  category,
  duration,
  viewerCount,
  price,
  isFree,
  isLive,
  onClick,
}: MovieCardProps) {
  const navigate = useNavigate();

  const goToDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/movie/${id}`);
  };

  return (
    <div
      className="movie-card card"
      onClick={() => {
        if (onClick) onClick();
        else navigate(`/movie/${id}`);
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className="movie-thumb">
        <img src={image} alt={title} className="img-cover" />
        <div className="overlay p4">
          <div className="flex gap-2 mb2">
            {isLive && <span className="badge bg-red">EN DIRECT</span>}
            {isFree && <span className="badge bg-green">GRATUIT</span>}
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-pri flex-1 center gap-1"
              onClick={goToDetails}
              aria-label={`Voir les détails de ${title}`}
            >
              <Play size={16} />
              <span>Voir détails</span>
            </button>
          </div>
        </div>
        {!isFree && price !== undefined && (
          <div className="badge abs top-2 right-2 bg-dark">
            {formatCurrency(price)}
          </div>
        )}
      </div>
      <div className="movie-info p3">
        <h3 className="movie-title">{title}</h3>
        {category && <p className="movie-category">{category}</p>}
        <div className="movie-stats flex gap-3 text-sm text-muted">
          {duration && (
            <div className="movie-duration flex items-center gap-1">
              <svg className="icon-clock" width="14" height="14" /* icon svg here or use lucide-react */ />
              <span>{duration}</span>
            </div>
          )}
          {viewerCount !== undefined && (
            <div className="movie-viewers flex items-center gap-1">
              <svg className="icon-users" width="14" height="14" />
              <span>{viewerCount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
