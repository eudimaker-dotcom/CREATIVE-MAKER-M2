import React from 'react';

interface FavoriteButtonProps {
  liked: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  likesCount?: number;
}

export default function FavoriteButton({ liked, onClick, className = '', likesCount = 0 }: FavoriteButtonProps) {
  // We can vary the colors based on likes count
  const gradientStyles = likesCount > 0
    ? { '--i': '#FF5E62', '--j': '#FF9966' } as React.CSSProperties
    : { '--i': '#6366f1', '--j': '#a855f7' } as React.CSSProperties;

  return (
    <div className={`reaction-wrapper ${className}`} onClick={onClick}>
      <div className="fav-button" style={gradientStyles}>
        {likesCount > 0 && <span className="reaction-count">{likesCount}</span>}
        <span className="icon">{likesCount > 0 ? '❤️' : '🤍'}</span>
        <span className="title">{likesCount > 0 ? `Likes: ${likesCount}` : 'Reagir'}</span>
      </div>
    </div>
  );
}

