import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";

const visitedRoutes = new Set();

const FullscreenAd = ({ ads }) => {
  const [show, setShow] = useState(false); // start hidden
  const [timeLeft, setTimeLeft] = useState(7);
  const location = useLocation();

  const ad = ads && ads.length > 0 ? ads[0] : null;

  // ⏱ Show ad
  useEffect(() => {
    if (!ad) return;
    if (visitedRoutes.has(location.pathname)) return;

    const showTimer = setTimeout(() => {
      setShow(true);
      visitedRoutes.add(location.pathname);
    }, 200);

    return () => clearTimeout(showTimer);
  }, [location.pathname, ad]);

  // ⏱ Auto remove
  useEffect(() => {
    if (!show) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShow(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show]);

  if (!show || !ad) return null;

  const AdContent = (
    <div className="relative w-full h-full flex gap-0 ">
      {/* Left Half */}
      <div className="relative w-1/2 h-full overflow-hidden animate-slide-left">
        {/* Background Blur */}
        <div className="absolute top-0 left-0 w-[200%] h-full">
          <img
            src={ad.image}
            alt={ad.title || "Ad"}
            className="w-full h-full object-cover blur-2xl opacity-60 scale-110"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <img
          src={ad.image}
          alt={ad.title || "Ad Left"}
          className="absolute top-0 left-0 w-[200%] h-full max-w-none object-contain z-10"
        />
      </div>

      {/* Right Half */}
      <div className="relative w-1/2 h-full overflow-hidden animate-slide-right">
        {/* Background Blur */}
        <div className="absolute top-0 right-0 w-[200%] h-full">
          <img
            src={ad.image}
            alt={ad.title || "Ad"}
            className="w-full h-full object-cover blur-2xl opacity-60 scale-110"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <img
          src={ad.image}
          alt={ad.title || "Ad Right"}
          className="absolute top-0 right-0 w-[200%] h-full max-w-none object-contain z-10"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={() => setShow(false)}
        className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-black/30 hover:bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all border border-white/10 group"
      >
        <span className="text-xs font-medium">Skip in {timeLeft}s</span>
        <X size={18} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Ad Container */}
      {ad.link ? (
        <a href={ad.link} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
          {AdContent}
        </a>
      ) : (
        AdContent
      )}
    </div>
  );
};

export default FullscreenAd;
