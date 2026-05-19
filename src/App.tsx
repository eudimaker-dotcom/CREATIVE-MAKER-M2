/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import Header from './components/Header';
import AdSlider from './components/AdSlider';
import FeaturedSlider from './components/FeaturedSlider';
import WhatsAppSection from './components/WhatsAppSection';
import TemplateCard from './components/TemplateCard';
import CartSidebar from './components/CartSidebar';
import TemplateDetailModal from './components/TemplateDetailModal';
import AIModal from './components/AIModal';
import { TEMPLATES } from './constants';
import { PSDTemplate, CartItem } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { getPublishedProducts } from './admin/dataService';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<PSDTemplate | null>(null);
  const [templates, setTemplates] = useState<PSDTemplate[]>(TEMPLATES);

  useEffect(() => {
    // Load initial products from admin service
    import('./admin/dataService').then(({ getPublishedProducts }) => {
      const published = getPublishedProducts();
      if (published.length > 0) {
        setTemplates(published);
      }
    }).catch(() => {}); // Ignore if not available

    const handleProductsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<PSDTemplate[]>;
      if (customEvent.detail) {
        setTemplates(customEvent.detail);
      }
    };
    
    window.addEventListener('products-updated', handleProductsUpdated);

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.removeEventListener('products-updated', handleProductsUpdated);
    };
  }, []);

  const addToCart = (template: PSDTemplate) => {
    if (cart.find(item => item.id === template.id)) {
      setIsCartOpen(true);
      return;
    }
    const newItem: CartItem = { ...template, addedAt: Date.now() };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleDownload = (template: PSDTemplate) => {
    const phoneNumber = "244930522736";
    const message = `Olá quero adquirir este Material: ${template.title}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const scrollToWhatsApp = () => {
    document.getElementById('whatsapp-community')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const phoneNumber = "244930522736";
    const titles = cart.map(item => item.title).join(", ");
    const message = `Olá quero adquirir estes Materiais: ${titles}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen selection:bg-indigo-500/30 selection:text-white relative bg-[#050505]">
      
      <Header 
        onAIClick={() => setIsAIModalOpen(true)}
        onPacksClick={scrollToWhatsApp}
        onUserClick={scrollToWhatsApp}
      />
      
      <main>
        <AdSlider />
        
        <FeaturedSlider onView={setActiveTemplate} templates={templates} />

        <section id="template-grid" className="p-[20px] py-8 md:px-[20px] max-w-7xl mx-auto">
          {/* Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <TemplateCard 
                  template={template} 
                  onDownload={handleDownload}
                  onView={setActiveTemplate}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        <WhatsAppSection />
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-20 border-t border-white/5 glass">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-md">
             <div className="flex items-center gap-2 mb-6 uppercase">
                <div className="w-2 h-2 brand-gradient-bg rounded-full" />
                <span className="font-sans font-bold text-lg tracking-tighter">Premium Hub</span>
             </div>
             <p className="text-xs text-brand-text-dim leading-relaxed font-medium">
               Fornecendo os melhores PSDs de excelência para designers que buscam agilidade e qualidade superior em seus projetos.
             </p>
          </div>
          
          <div className="w-full md:w-auto">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6 font-display">Newsletters</h4>
            <p className="text-xs text-brand-text-dim mb-4">Receba novos templates toda semana no seu e-mail.</p>
            <div className="flex gap-2 max-w-sm">
              <input type="text" placeholder="E-mail" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              <button className="px-6 py-2 rounded-lg bg-indigo-600 text-xs font-bold ring-1 ring-white/10">OK</button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-brand-text-dim font-bold">
            © 2026 PREMIUM HUB — DESIGNED FOR THE ELITE
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-brand-text-dim">
            <a href="#" className="hover:text-white">Instagram</a>
            <button onClick={scrollToWhatsApp} className="hover:text-white cursor-pointer transition-colors uppercase">WhatsApp</button>
          </div>
        </div>
      </footer>

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <TemplateDetailModal
        template={activeTemplate}
        onClose={() => setActiveTemplate(null)}
        onDownload={handleDownload}
      />

      <AIModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </div>
  );
}
