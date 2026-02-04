import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const BottomAdBanner = () => {
  const [open, setOpen] = useState(true);

  const ads = [
    "/banner.jpg",
    "/banner.jpg",
  ];

  return (
    <div
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl transition-transform duration-300
        ${open ? "translate-y-0" : "translate-y-[calc(100%_-_34px)]"}`}
    >
      {/* Arrow Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setOpen(!open)}
          className="mb-1 flex items-center justify-center rounded-md bg-white border shadow px-3 py-1 text-brand-gold hover:bg-brand-red hover:text-white transition-all font-bold"
        >
          {open ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {/* Banner Image */}
      <div className="bg-white rounded-lg">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="w-full rounded-xl"
        >
          {ads.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt="Advertisement"
                className="w-full rounded-lg border border-gray-200 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BottomAdBanner;
