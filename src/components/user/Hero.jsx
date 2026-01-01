import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Hero({ banners }) {
  if (!banners.length) {
    return null;
  }

  return (
    <section className="relative w-full h-full 2xl:h-full text-white group rounded-lg">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id || banner.title}>
            <div className="relative w-full lg:h-full rounded-lg">
              <img
                src={banner.image}
                alt={banner.title || "Banner image"}
                className="w-full lg:h-full object-fill rounded-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
