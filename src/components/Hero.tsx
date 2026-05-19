import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLImageElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -350]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const rotateS = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const scrollToShape = () => {
    shapeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToAcervo = () => {
    const section = document.getElementById('template-grid');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={containerRef} className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Parallax Floating Shapes removed as per background update request */}
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl"
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-sans font-bold leading-[0.85] tracking-tighter mb-10 uppercase">
          <span className="text-gradient">Eleve o seu</span> <br />
          Workflow.
        </h1>
        
        <p className="text-lg md:text-xl text-brand-text-dim max-w-2xl mx-auto mb-14 font-light leading-relaxed">
          Encontre aqui os melhores projetos angolanos. <br className="hidden md:block" />
          Velocidade industrial. Qualidade de estúdio. Camadas Perfeitas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="absolute top-10 left-10 flex items-center gap-2 opacity-30 group">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Curated in Luanda</span>
          </div>
          <button 
            onClick={scrollToAcervo}
            className="group relative h-16 px-12 rounded-full bg-white text-black font-bold text-xs uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <span className="relative z-10">Explorar Acervo</span>
            <motion.div 
              className="absolute inset-0 brand-gradient-bg opacity-0 group-hover:opacity-10 transition-opacity"
            />
          </button>
        </div>
      </motion.div>

      {/* Decorative vertical lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/10 to-transparent z-0" />
    </section>
  );
}
