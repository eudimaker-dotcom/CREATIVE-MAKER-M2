import { Search, MessageCircle, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import CosmicSearchBar from './CosmicSearchBar';
import AIButton from './AIButton';

interface HeaderProps {
  onAIClick: () => void;
  onPacksClick?: () => void;
  onUserClick?: () => void;
}

export default function Header({ onAIClick, onPacksClick, onUserClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full glass h-20 px-10 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center min-w-[200px]">
        <a href="/" className="flex items-center">
          <div className="w-2 h-2 mr-2 rounded-full brand-gradient-bg" />
          <span className="font-sans font-bold text-lg tracking-tighter hidden sm:block uppercase">
            Premium Hub
          </span>
        </a>
      </div>

      <div className="flex-1 hidden md:flex justify-center">
        <CosmicSearchBar />
      </div>

      <div className="flex items-center min-w-[200px] justify-end">
        <nav className="hidden lg:flex items-center gap-8 mr-6 relative">
          <a href="#template-grid" className="text-xs font-bold uppercase tracking-widest text-brand-text-dim hover:text-brand-text transition-colors">Templates</a>
          <button onClick={onPacksClick} className="text-xs font-bold uppercase tracking-widest text-brand-text-dim hover:text-brand-text transition-colors">Packs</button>
          <div className="flex items-center origin-center">
            <AIButton 
              label="Inteligência Artificial"
              onClick={onAIClick}
            />
          </div>
        </nav>
        
        <div className="flex items-center gap-6">
          <div 
            onClick={onUserClick}
            title="Comunidade WhatsApp"
            className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 overflow-hidden cursor-pointer hover:bg-emerald-500/20 transition-colors flex items-center justify-center group"
          >
            <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </header>
  );
}
