import { useLocation } from "react-router-dom";
import Header from "./Header";
import FlashNews from "./FlashNews";
import Footer from "./Footer";
import CustomLoader from "./CustomLoader";

export default function ConditionalLayout({ children,loading  }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/hmedianews");

  if (loading) {
    return <CustomLoader />;
  }

  // Admin pages → no header/footer
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Public pages → full layout
  return (
    <>
      <Header />
      <FlashNews />
      {children}
      <Footer />
    </>
  );
}
