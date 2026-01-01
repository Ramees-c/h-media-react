import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function FullWidthAd({ ads }) {
  if (!ads || ads.length === 0) {
    return null;
  }

  return (
    <section className="w-full lg:py-8">
      <div>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="rounded-lg"
        >
          {ads.map((ad, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full">
                {/* Ad Image */}
                {ad.link ? (
                  <a href={ad.link} className="block">
                    <img
                      src={ad.image}
                      alt="Advertisement"
                      className="w-full h-auto object-cover"
                    />
                  </a>
                ) : (
                  <img
                    src={ad.image}
                    alt="Advertisement"
                    className="w-full h-auto object-cover"
                  />
                )}

                {/* Contact Button */}
                {ad.showContact && (
                  <a
                    href="mailto:hmediachannel@gmail.com"
                    className="
                    absolute bottom-8 right-1
                    md:bottom-16 md:right-2 lg:bottom-16 lg:right-2 xl:bottom-22 xl:right-3 2xl:bottom-28 2xl:right-3
                    bg-brand-red text-white 
                    py-1 px-2 sm:px-3 sm:py-1.5
                    md:px-4 md:py-2 lg:px-4 lg:py-2 xl:px-5 xl:py-2
                    rounded-lg 
                    text-[6px] md:text-sm lg:text-base xl:text-base
                    font-semibold
                    shadow-lg
                    hover:bg-brand-dark transition
                  "
                  >
                    Contact Us
                  </a>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
