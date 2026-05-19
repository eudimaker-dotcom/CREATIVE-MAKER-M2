import React from 'react';

interface FavoriteButtonProps {
  liked: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export default function FavoriteButton({ liked, onClick, className = '' }: FavoriteButtonProps) {
  // We can vary the colors based on liked state if we want, 
  // but the user's CSS uses specific --i and --j variables.
  const gradientStyles = liked 
    ? { '--i': '#FF5E62', '--j': '#FF9966' } as React.CSSProperties
    : { '--i': '#6366f1', '--j': '#a855f7' } as React.CSSProperties;

  return (
    <div className={`reaction-wrapper ${className}`} onClick={onClick}>
      <div className="fav-button" style={gradientStyles}>
        <span className="icon">{liked ? '❤️' : '🤍'}</span>
        <span className="title">{liked ? 'Favorito' : 'Curtir'}</span>
      </div>
    </div>
  );
}
