import { useEffect } from "react";
import { X } from "lucide-react";

export default function VideoPlayerModal({ youtubeId, onClose }) {
  useEffect(() => {
    if (youtubeId) {
      // When modal is open, disable body scroll
      document.body.classList.add("overflow-hidden");
      // Hide any global loader that might be stuck
      window.dispatchEvent(new Event("hide-loader"));
    } else {
      // When modal is closed, re-enable body scroll
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [youtubeId]);

  if (!youtubeId) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => {
        window.dispatchEvent(new Event("hide-loader"));
        onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the video player
      >
        <button
          onClick={() => {
            window.dispatchEvent(new Event("hide-loader"));
            onClose();
          }}
          className="absolute -top-3 -right-3 z-10 bg-white text-black rounded-full p-1.5 hover:bg-gray-200 transition-transform hover:scale-110 cursor-pointer"
          aria-label="Close video player"
        >
          <X size={20} />
        </button>
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
