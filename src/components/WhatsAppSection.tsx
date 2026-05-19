import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppSection() {
  return (
    <section id="whatsapp-community" className="px-6 md:px-[20px] py-12">
      <div className="max-w-7xl mx-auto relative rounded-[24px] overflow-hidden glass p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="absolute inset-0 brand-gradient-bg opacity-5 pointer-events-none" />
        
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-emerald-400">Comunidade VIP</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight tracking-tight uppercase">
            Venha fazer parte da nossa comunidade no <span className="text-emerald-400">WhatsApp</span>
          </h2>
          
          <p className="text-brand-text-dim text-sm mb-6 max-w-xl">
            Receba novidades em primeira mão, suporte exclusivo e troque experiências com outros criativos angolanos.
          </p>
          
          <button className="h-12 px-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase tracking-widest text-[10px] transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:scale-105 active:scale-95">
            Entrar no Grupo WhatsApp
          </button>
        </div>

        <div className="w-48 h-48 bg-white p-4 rounded-2xl shadow-2xl relative z-10 shrink-0 group transition-transform hover:rotate-3">
          <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden bg-slate-50">
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                <div className="w-20 h-20 bg-slate-100 rounded-md animate-pulse" />
                <span className="text-[7px] uppercase tracking-widest font-black">Código QR Escanear</span>
             </div>
          </div>
          <div className="absolute -top-3 -right-3 w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
}

