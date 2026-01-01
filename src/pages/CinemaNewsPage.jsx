import { useState, useEffect } from "react";
import { useApi } from "../context/ApiContext";
import { fetchCinemaNews } from "../services/cinemaNewsService";
import {
  fetchBannerAds,
  fetchSquareAds,
} from "../services/advertisementService";
import AdList from "../components/user/AdList";
import FullWidthAd from "../components/user/FullWidthAd";
import NewsPagination from "../components/user/NewsPagination";
import ArticleCard from "../components/user/ArticleCard";
import CustomLoader from "../components/user/CustomLoader";

function CinemaNewsPage({ searchParams }) {
  const { baseURL } = useApi();

  const [cinemaNews, setCinemaNews] = useState([]);
  const [squareAds, setSquareAds] = useState([]);
  const [bannerAds, setBannerAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 9;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        // Fetch cinema news
        const cinemaData = await fetchCinemaNews(baseURL);
        cinemaData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setCinemaNews(cinemaData);

        // Fetch square ads
        const squareData = await fetchSquareAds(baseURL);
        const filteredSquareAds = squareData
          .filter(
            (ad) => ad.status && ad.page_type?.toLowerCase() === "cinema news"
          )
          .sort((a, b) => a.order - b.order)
          .slice(0, 3)
          .map((ad) => ({
            image: `${baseURL}/${ad.image.replace(/\\/g, "/")}`,
            link: ad.link || "#",
            showContact: ad.show_contact,
            title: ad.title,
          }));
        setSquareAds(filteredSquareAds);

        // Fetch banner ads
        const bannerData = await fetchBannerAds(baseURL);
        const filteredBannerAds = bannerData
          .filter(
            (ad) => ad.status && ad.page_type?.toLowerCase() === "cinema news"
          )
          .sort((a, b) => a.order - b.order)
          .slice(0, 5)
          .map((ad) => ({
            image: `${baseURL}/${ad.image.replace(/\\/g, "/")}`,
            link: ad.link,
            showContact: ad.show_contact,
            title: ad.title,
          }));
        setBannerAds(filteredBannerAds);
      } catch (error) {
        console.log("fetch error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [baseURL]);

  const totalPages = Math.ceil(cinemaNews.length / itemsPerPage);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentArticles = cinemaNews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading)
    return (
      <>
        <CustomLoader />
      </>
    );
  return (
    <main className="min-h-screen bg-gray-50 text-[#141414]">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ================= MAIN CONTENT (Latest News Grid) ================= */}
        <div className="lg:col-span-9 flex flex-col gap-10">
          <h2
            className="text-lg sm:text-xl md:text-2xl font-black uppercase 
        border-b-2 border-brand-red pb-2 text-brand-dark mb-6"
          >
            Cinema News
          </h2>

          <div className="grid md:grid-cols-3 gap-3">
            {/* Map through the sample data to display the articles */}
            {currentArticles.map((article) => (
              <ArticleCard
                key={article.id}
                category="cinema-news"
                title={article.title}
                image={`${baseURL}/${article.image.replace(/\\/g, "/")}`}
                date={article.date}
                slug={article.slug}
                content={article.content}
              />
            ))}
          </div>

          <NewsPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
          />

          <FullWidthAd ads={bannerAds} />
        </div>

        <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 self-start">
          <AdList ads={squareAds} />
        </aside>
      </div>
    </main>
  );
}

export default CinemaNewsPage;
