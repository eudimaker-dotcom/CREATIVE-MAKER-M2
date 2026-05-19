import React, { useState, useEffect } from 'react';
import { X, FileText, Layout, Expand, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PSDTemplate } from '../types';
import DownloadButton from './DownloadButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { incrementLikes } from '../admin/dataService';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TemplateDetailModalProps {
  template: PSDTemplate | null;
  onClose: () => void;
  onDownload: (template: PSDTemplate) => void;
}

export default function TemplateDetailModal({ template, onClose, onDownload }: TemplateDetailModalProps) {
  const [localLikes, setLocalLikes] = useState(0);

  useEffect(() => {
    if (template) {
      setLocalLikes(template.likes_count || 0);
    }
  }, [template]);

  if (!template) return null;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalLikes(prev => prev + 1);
    incrementLikes(template.id);
  };

  return (
    <AnimatePresence>
      {template && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-[15px]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="pointer-events-auto relative w-full max-w-[1200px] h-[80vh] bg-brand-bg rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-[120] p-2 rounded-full glass backdrop-blur-md hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left Column: Media Gallery */}
              <div className="relative w-full md:w-[50%] h-1/2 md:h-full bg-black flex items-center justify-center overflow-hidden modal-gallery group">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={{
                    nextEl: '.swiper-button-next-modal',
                    prevEl: '.swiper-button-prev-modal',
                  }}
                  pagination={{
                    clickable: true,
                    el: '.swiper-pagination-modal',
                  }}
                  loop={template.gallery.length > 1}
                  className="w-full h-full"
                >
                  {template.gallery.map((img, i) => (
                    <SwiperSlide key={i} className="flex items-center justify-center p-4">
                      <img
                        src={img}
                        alt={`${template.title} view ${i + 1}`}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation */}
                {template.gallery.length > 1 && (
                  <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between z-[130] pointer-events-none">
                    <button className="swiper-button-prev-modal pointer-events-auto p-4 rounded-full glass backdrop-blur-xl hover:bg-white/20 transition-all active:scale-95 text-white/80 border border-white/5 shadow-xl">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button className="swiper-button-next-modal pointer-events-auto p-4 rounded-full glass backdrop-blur-xl hover:bg-white/20 transition-all active:scale-95 text-white/80 border border-white/5 shadow-xl">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                )}

                {/* Custom Pagination */}
                <div className="swiper-pagination-modal absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2" />
              </div>

              {/* Right Column: Info Panel */}
              <div className="w-full md:w-[50%] h-1/2 md:h-full overflow-y-auto glass-heavy p-6 md:p-8 border-l border-white/10 no-scrollbar relative details-panel flex flex-col justify-between">
                 {/* Faint Purple Orbs */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] -z-10" />
                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[60px] -z-10" />

                 <div>
                   <div className="mb-6">
                     <p className="text-[10px] uppercase tracking-[3px] text-brand-text-dim mb-2 font-bold">{template.category}</p>
                     <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-gradient mb-3">
                       {template.title}
                     </h1>
                     <p className="text-brand-text-dim text-xs leading-relaxed font-light line-clamp-3">
                       {template.description}
                     </p>
                   </div>

                   {/* Metadata Micro Grid */}
                   <div className="grid grid-cols-2 gap-3">
                     <DetailBox label="Tamanho" value={template.fileSize} icon={<FileText className="w-4 h-4" />} />
                     <DetailBox label="Formato" value="Adobe Photoshop (PSD)" icon={<Layout className="w-4 h-4" />} />
                     <DetailBox label="Arquivos" value="Camadas Inclusas" icon={<CheckCircle2 className="w-4 h-4" />} />
                     <DetailBox label="Resolução" value="300 DPI Alta Res" icon={<Expand className="w-4 h-4" />} />
                   </div>
                 </div>

                 <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 items-center">
                    <div className="flex-1">
                      <DownloadButton 
                        onClick={() => onDownload(template)}
                      />
                    </div>
                    <button
                      onClick={handleLike}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all text-rose-500 flex items-center justify-center gap-2 group cursor-pointer"
                      title="Reagir a este template"
                    >
                      <span className="text-lg">❤️</span>
                      <span className="text-xs font-semibold text-brand-text group-hover:text-rose-400">
                        {localLikes}
                      </span>
                    </button>
                 </div>
                 <p className="text-[9px] text-center text-brand-text-dim mt-2 uppercase tracking-widest font-medium opacity-40">
                   Garantia de Qualidade Premium Hub &bull; Licença Comercial
                 </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}


function DetailBox({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
      <div className="text-indigo-400 p-2 bg-white/5 rounded-xl">{icon}</div>
      <div className="overflow-hidden">
        <p className="text-[8px] uppercase tracking-wider text-brand-text-dim font-bold opacity-60 mb-0.5">{label}</p>
        <p className="text-[11px] font-semibold text-brand-text truncate">{value}</p>
      </div>
    </div>
  );
}
