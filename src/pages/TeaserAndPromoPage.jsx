import { useState, useEffect } from "react";
import { useApi } from "../context/ApiContext";
import { fetchTeasers } from "../services/teaserPromoService";
import NewsPagination from "../components/user/NewsPagination";
import VideoPlayerWrapper from "../components/user/VideoModalWrapper";
import CustomLoader from "../components/user/CustomLoader";

import { useSearchParams } from "react-router-dom";

function TeaserAndPromoPage() {
  const [searchParams] = useSearchParams();
  const { baseURL } = useApi();

  const [teasers, setTeasers] = useState([]);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 12;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchTeasers(baseURL);

        const sortedActiveTeasers = data
          .filter((teaser) => teaser.active_inactive)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setTeasers(sortedActiveTeasers);
      } catch (error) {
        console.log("Teaser And Promo Error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [baseURL]);

   useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [searchParams]);

  const totalPages = Math.ceil(teasers.length / itemsPerPage);
  const safePage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (safePage - 1) * itemsPerPage;
  const currentTeasers = teasers.slice(startIndex, startIndex + itemsPerPage);

  if (loading)
    return (
      <>
        <CustomLoader />
      </>
    );
  return (
    <main className="min-h-screen bg-gray-50 text-[#141414]">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <h2
          className="text-lg sm:text-xl md:text-2xl font-black uppercase 
          border-b-2 border-brand-red pb-2 text-brand-dark mb-16"
        >
          Teasers & Promos
        </h2>

        {/* Video Grid */}
        <VideoPlayerWrapper teasers={currentTeasers} />

        {/* Pagination */}
        <NewsPagination currentPage={safePage} totalPages={totalPages} />
      </div>
    </main>
  );
}

export default TeaserAndPromoPage;
