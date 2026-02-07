import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";

const visitedRoutes = new Set();

export default function PopupAd({ ads }) {
  const [show, setShow] = useState(false);
  const location = useLocation();

  // Show popup after 2 seconds, only once per route
  useEffect(() => {
    if (!ads || ads.length === 0) return;

    if (visitedRoutes.has(location.pathname)) return;

    const timer = setTimeout(() => {
      setShow(true);
      visitedRoutes.add(location.pathname);
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname, ads]);

  // Auto close after 15 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || !ads || ads.length === 0) return null;

  const ad = ads[0];

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60"
      onClick={() => setShow(false)}
    >
      {/* IMAGE CONTAINER */}
      <div
        className="relative w-auto max-w-[90%] sm:max-w-[60%] rounded-lg overflow-hidden shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 z-10 bg-black/70 text-white rounded-full p-1 hover:bg-black cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* IMAGE ONLY */}
        {ad.link ? (
          <a href={ad.link} target="_blank" rel="noopener noreferrer">
            <img
              src={ad.image}
              alt={ad.title || "Popup Ad"}
              className="w-auto h-auto max-h-[80vh] max-w-full object-contain cursor-pointer"
            />
          </a>
        ) : (
          <img
            src={ad.image}
            alt={ad.title || "Popup Ad"}
            className="w-auto h-auto max-h-[80vh] max-w-full object-contain"
          />
        )}
      </div>
    </div>
  );
}
