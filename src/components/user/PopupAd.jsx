import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";

const visitedRoutes = new Set();

export default function PopupAd() {
  const [show, setShow] = useState(false);
  const location = useLocation();

  // Show popup after 2 seconds, only once per route
  useEffect(() => {
    if (visitedRoutes.has(location.pathname)) return;

    const timer = setTimeout(() => {
      setShow(true);
      visitedRoutes.add(location.pathname);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Auto close after 10 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60"
      onClick={() => setShow(false)}
    >
      {/* IMAGE CONTAINER */}
      <div
        className="relative w-auto max-w-[60%] rounded-lg overflow-hidden shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 z-10 bg-black/70 text-white rounded-full p-1 hover:bg-black"
        >
          <X size={18} />
        </button>

        {/* IMAGE ONLY */}
        <img
          src="/ad_sample2.jpeg"
          alt="Popup Ad"
          className="w-auto h-auto max-w-full object-contain cursor-pointer"
        />
      </div>
    </div>
  );
}
