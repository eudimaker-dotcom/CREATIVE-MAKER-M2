import { motion } from 'motion/react';
import { useState } from 'react';
import { PSDTemplate } from '../types';
import DownloadButton from './DownloadButton';
import FavoriteButton from './FavoriteButton';
import { incrementLikes } from '../admin/dataService';

interface TemplateCardProps {
  template: PSDTemplate;
  onDownload: (template: PSDTemplate) => void;
  onView: (template: PSDTemplate) => void;
}

export default function TemplateCard({ template, onDownload, onView }: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  return (
    <motion.div 
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={() => onView(template)}
      className="group relative flex flex-col gap-3 cursor-pointer template-card"
      style={{
        // @ts-ignore
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
      } as React.CSSProperties}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-white/[0.02] border border-white/10 card-hover-effect shadow-2xl backdrop-blur-sm">
        {/* Main Image */}
        <motion.img 
          src={template.image} 
          alt={template.title}
          loading="lazy"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="w-full h-full object-cover template-image"
        />

        {/* Overlay Graduate */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite Button Overlay */}
        <FavoriteButton 
          liked={(template.likes_count || 0) > 0} 
          likesCount={template.likes_count || 0}
          onClick={(e) => {
            e.stopPropagation();
            incrementLikes(template.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Download Button Overlay - Managed by template-card CSS */}
        <DownloadButton 
          onClick={(e) => {
            e.stopPropagation();
            onDownload(template);
          }}
        />
      </div>

      {/* Info & Color Palette */}
      <div className="px-2 pb-2">
        <h3 className="font-sans font-semibold text-[15px] mb-1">{template.title}</h3>
        
        <div className="flex items-center justify-between">
          <div className="text-[11px] text-brand-text-dim flex gap-2 font-medium">
            <span>PSD</span>
            <span>&bull;</span>
            <span>{template.fileSize}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-brand-text-dim/80 font-medium">
            <span>❤️</span>
            <span>{template.likes_count || 0}</span>
          </div>
        </div>
        
        {/* Color Palette Extraction Display */}
        <div className="flex gap-1.5 mt-3">
          {template.colors.slice(0, 5).map((color, i) => (
            <div 
              key={i} 
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
