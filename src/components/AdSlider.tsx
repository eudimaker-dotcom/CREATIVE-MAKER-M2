import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const ADS = [
  {
    id: 1,
    gradient: "bg-gradient-to-br from-[#c27618] via-[#008ba3] to-[#7c00e0]",
    title: "Novos Packs Semanais",
    subtitle: "Atualize seu arsenal criativo agora"
  },
  {
    id: 2,
    gradient: "bg-gradient-to-bl from-[#7c00e0] via-[#008ba3] to-[#c27618]",
    title: "IA Generativa Integrada",
    subtitle: "O futuro do design chegou ao Premium Hub"
  }
];

export default function AdSlider() {
  return (
    <section className="w-full px-6 md:px-[20px] py-10">
      <div className="max-w-7xl mx-auto rounded-[40px] overflow-hidden h-[300px] md:h-[400px] border border-white/5 relative shadow-2xl">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-full w-full"
        >
          {ADS.map(ad => (
            <SwiperSlide key={ad.id}>
              <div className={`relative w-full h-full ${ad.gradient} flex flex-col items-center justify-center text-center px-6`}>
                {/* Abstract shape overlays to mimic the waves in screenshot */}
                <div className="absolute inset-0 overflow-hidden opacity-60">
                   <div className="absolute top-[-50%] right-[-10%] w-[120%] h-[150%] rounded-[100%] bg-[#7c00e0] blur-[150px] animate-pulse" />
                   <div className="absolute bottom-[-50%] left-[-20%] w-[100%] h-[150%] rounded-[100%] bg-[#008ba3] blur-[120px]" />
                   <div className="absolute top-[20%] left-[-30%] w-[80%] h-[100%] rounded-[100%] bg-[#c27618] blur-[100px] opacity-40" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 drop-shadow-lg">
                    {ad.title}
                  </h2>
                  <p className="text-white/80 text-xs md:text-sm uppercase tracking-[0.5em] font-black drop-shadow-md">
                    {ad.subtitle}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
