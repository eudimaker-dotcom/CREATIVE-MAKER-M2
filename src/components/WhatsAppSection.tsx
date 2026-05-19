import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppSection() {
  return (
    <section id="whatsapp-community" className="px-6 md:px-[20px] py-24">
      <div className="max-w-7xl mx-auto relative rounded-[40px] overflow-hidden glass p-12 md:p-24 border border-white/10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
        <div className="absolute inset-0 brand-gradient-bg opacity-5 pointer-events-none" />
        
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-400">Comunidade VIP</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-[0.95] tracking-tighter uppercase">
            Venha fazer parte da nossa comunidade no <span className="text-emerald-400">WhatsApp</span>
          </h2>
          
          <p className="text-brand-text-dim text-lg mb-12 max-w-xl">
            Receba novidades em primeira mão, suporte exclusivo e troque experiências com outros criativos angolanos.
          </p>
          
          <button className="h-16 px-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95">
            Entrar no Grupo WhatsApp
          </button>
        </div>

        <div className="w-64 h-64 bg-white p-6 rounded-3xl shadow-2xl relative z-10 shrink-0 group transition-transform hover:rotate-3">
          <div className="w-full h-full border-4 border-dashed border-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden bg-slate-50">
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-400">
                <div className="w-32 h-32 bg-slate-100 rounded-lg animate-pulse" />
                <span className="text-[8px] uppercase tracking-widest font-black">Escanear QR Code</span>
             </div>
             {/* Placeholder for real QR component in production */}
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
