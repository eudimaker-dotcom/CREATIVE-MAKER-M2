import { X, CheckCircle2, FileText, Layout, Expand, Download, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function CartSidebar({ isOpen, onClose, items, onRemove, onCheckout }: CartSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-[70] w-full max-w-sm h-full glass-heavy p-10 flex flex-col shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-10">
              <span className="text-xl">📂</span>
              <h2 className="text-sm font-bold uppercase tracking-widest">Detalhes do Arquivo</h2>
              <button 
                onClick={onClose}
                className="ml-auto p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-10 pr-2 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <p className="text-xs uppercase tracking-widest font-bold">Vazio</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={item.id} 
                    className="space-y-6 cart-item"
                  >
                    <div className="flex gap-4 border-b border-white/5 pb-6">
                      {/* Thumbnail with 4:5 ratio */}
                      <div className="img-container rounded-lg bg-brand-surface border border-white/10">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-sm truncate leading-tight">{item.title}</h3>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-rose-500 hover:text-rose-400 transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold">
                            <span className="text-brand-text-dim opacity-60">Tamanho:</span>
                            <span className="text-brand-text">{item.fileSize}</span>
                          </div>
                          <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold">
                            <span className="text-brand-text-dim opacity-60">Formato:</span>
                            <span className="text-brand-text">PSD</span>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          {item.colors.map((color, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-10 pt-10 border-t border-white/10">
                <button 
                  onClick={onCheckout}
                  className="w-full h-14 rounded-full brand-gradient-bg text-white font-bold uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  Baixar Agora
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatusItem({ label, value, accent }: { label: string, value: string, accent?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-brand-text-dim uppercase tracking-widest font-bold mb-1 opacity-60">
        {label}
      </span>
      <span className={`text-xs font-semibold ${accent ? 'text-indigo-400' : 'text-brand-text'}`}>
        {value}
      </span>
    </div>
  );
}
