import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import VideoPlayerModal from "./VideoPlayerModal";

export default function Hero({ banners }) {
  const swiperRef = useRef(null);
  const [youtubeId, setYoutubeId] = useState(null);

  if (!banners.length) {
    return null;
  }

  const getYoutubeId = (url) => {
    if (!url) return null;

    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <section className="relative w-full h-full 2xl:h-full text-white group rounded-lg">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        className="w-full h-full"
      >
        {banners.map((banner) => {
          const ytId = getYoutubeId(banner.link);

          return (
            <SwiperSlide key={banner.id || banner.title}>
              {ytId ? (
                /* YOUTUBE → MODAL */
                <div
                  onClick={() => {
                    swiperRef.current?.autoplay?.stop();
                    setYoutubeId(ytId);
                  }}
                  className="relative w-full lg:h-full rounded-lg block cursor-pointer"
                >
                  <img
                    src={banner.image}
                    alt={banner.title || "Banner image"}
                    draggable={false}
                    className="w-full lg:h-full object-fill rounded-lg cursor-pointer"
                  />
                </div>
              ) : banner.link ? (
                /* NORMAL LINK */
                <a
                  href={banner.link}
                  className="relative w-full lg:h-full rounded-lg block cursor-pointer"
                  {...(!banner.link.startsWith(window.location.origin) && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                >
                  <img
                    src={banner.image}
                    alt={banner.title || "Banner image"}
                    draggable={false}
                    className="w-full lg:h-full object-fill rounded-lg cursor-pointer"
                  />
                </a>
              ) : (
                /* NO LINK */
                <div className="relative w-full lg:h-full rounded-lg block">
                  <img
                    src={banner.image}
                    alt={banner.title || "Banner image"}
                    draggable={false}
                    className="w-full lg:h-full object-fill rounded-lg cursor-default"
                  />
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      <VideoPlayerModal
        youtubeId={youtubeId}
        onClose={() => {
          setYoutubeId(null);
          swiperRef.current?.autoplay?.start();
        }}
      />
    </section>
  );
}
