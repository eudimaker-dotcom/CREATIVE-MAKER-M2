import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Scrollbar, Autoplay, Keyboard } from 'swiper/modules';
import { PSDTemplate } from '../types';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

interface FeaturedSliderProps {
  onView: (template: PSDTemplate) => void;
  templates: PSDTemplate[];
}

export default function FeaturedSlider({ onView, templates }: FeaturedSliderProps) {
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const featuredTemplates = templates.slice(0, 5); // Showcase 5 most recent templates

  return (
    <section className="pt-12 pb-4 px-4 md:px-10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-text-dim mb-4">Experiência Spotlight</h2>
        <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">
          Destaques <span className="brand-gradient-text">Premium</span>
        </h3>
      </div>

      <div className="swiper-container-wrapper">
        <Swiper
          key={featuredTemplates.map(t => t.id).join('-')}
          onSwiper={setSwiperRef}
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={'auto'}
          speed={1000} // Ultra-smooth slow transition speed
          coverflowEffect={{
            rotate: 15,
            stretch: -20, // Overlap slides slightly for elegant layered look
            depth: 180,   // Deeper 3D perspective
            modifier: 1.5,
            slideShadows: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={true}
          scrollbar={{ draggable: true }}
          keyboard={{ enabled: true }}
          modules={[EffectCoverflow, Navigation, Scrollbar, Autoplay, Keyboard]}
          className="featured-swiper"
        >
          {featuredTemplates.map((template, index) => (
            <SwiperSlide 
              key={template.id} 
              className="featured-slide"
              onMouseEnter={() => {
                if (swiperRef) {
                  swiperRef.slideToLoop(index);
                }
              }}
            >
              <div 
                className="relative group cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
                onClick={() => onView(template)}
              >
                <div className="img-container aspect-[4/5] bg-white/[0.02]">
                  <img 
                    src={template.image} 
                    alt={template.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">{template.category}</p>
                    <h4 className="text-xl font-bold text-white uppercase tracking-tight">{template.title}</h4>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
          <div className="swiper-scrollbar"></div>
        </Swiper>
      </div>
    </section>
  );
}
