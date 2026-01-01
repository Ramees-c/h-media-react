import { Link } from "react-router-dom";

export default function AdBanner({ image, link, onContact }) {
  const ImageComponent = () => (
    <div className="relative w-full h-full">
      {/* Image */}
      <img
        src={image}
        alt="Advertisement"
        className="w-full h-full object-cover rounded-lg"
      />

      {/* Contact Button */}
      {onContact && (
        <a href="mailto:hmediachannel@gmail.com">
          <button
            className="
          absolute bottom-2 sm:bottom-3 md:bottom-2 xl:bottom-4 left-1/2 -translate-x-1/2
          bg-brand-red text-white 
          px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-1.5 lg:py-1.5 rounded-lg 
          text-xs sm:text-sm md:text-sm font-semibold
          shadow-lg
          hover:bg-brand-dark transition cursor-pointer
          whitespace-nowrap
        "
          >
            Contact Us
          </button>
        </a>
      )}
    </div>
  );

  if (link === "#") {
    return (
      <div className="block relative">
        <ImageComponent />
      </div>
    );
  } else {
    return (
      <Link to={link} target="_blank" className="block relative">
        <ImageComponent />
      </Link>
    );
  }
}
