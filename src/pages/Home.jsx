import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useApi } from "../context/ApiContext";
import { fetchBanners, fetchBannersHome } from "../services/bannerService";
import Hero from "../components/user/Hero";
import {
  fetchTrendingNews,
  fetchTrendingNewsLimit,
} from "../services/trendingNewsService";
import NewsColumn from "../components/user/NewsColumn";
import { fetchMoreNews, fetchMoreNewsLimit } from "../services/moreNewsService";
import {
  fetchTeasers,
  fetchTeasersLimit,
} from "../services/teaserPromoService";
import {
  fetchBannerAds,
  fetchSquareAds,
} from "../services/advertisementService";
import {
  fetchLatestNews,
  fetchLatestNewsLimit,
} from "../services/latestNewsService";
import {
  fetchCinemaNews,
  fetchCinemaNewsLimit,
} from "../services/cinemaNewsService";
import {
  fetchMeetPersons,
  fetchMeetPersonsLimit,
} from "../services/meetPersonService";
import FullWidthAd from "../components/user/FullWidthAd";
import AdList from "../components/user/AdList";
import MediaSlider from "../components/user/MediaSlider";
import CustomLoader from "../components/user/CustomLoader";
import { InlineGoogleAd } from "../components/user/GoogleAd";
import VideoVerticalSlider from "../components/user/VideoVerticalSlider";

const getYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?&/]+)/,
    /\/embed\/([^?&/]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m && m[1]) return m[1];
  }
  const m = url.match(/([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};

const safeImage = (baseURL, image) => {
  if (!image) return null; // or fallback image path
  return `${baseURL}/${image.replace(/\\/g, "/")}`;
};

function Home() {
  const { baseURL } = useApi();
  const [latestNews, setLatestNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [cinemaNews, setCinemaNews] = useState([]);
  const [meetThePerson, setMeetThePerson] = useState([]);
  const [moreNews, setMoreNews] = useState([]);
  const [banners, setBanners] = useState([]);
  const [teasers, setTeasers] = useState([]);
  const [squareAds, setSquareAds] = useState([]);
  const [bannerAds, setBannerAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingCinema, setLoadingCinema] = useState(true);
  const [loadingMeet, setLoadingMeet] = useState(true);

  useEffect(() => {
    async function loadData() {
      const promises = [];

      /* -------- Latest News -------- */
      // promises.push(
      //   fetchLatestNews(baseURL)
      //     .then((latestData) => {
      //       latestData.sort(
      //         (a, b) => new Date(b.created_at) - new Date(a.created_at)
      //       );
      //       setLatestNews(
      //         latestData.slice(0, 5).map((item) => ({
      //           title: item.title,
      //           image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
      //           date: item.date,
      //           slug: item.slug,
      //           content: item.content,
      //         }))
      //       );
      //     })
      //     .catch((err) => console.error("Latest News Error"))
      //     .finally(() => setLoadingLatest(false))
      // );

      promises.push(
        fetchLatestNewsLimit(baseURL)
          .then((latestData) => {
            setLatestNews(
              latestData.map((item) => ({
                title: item.title,
                image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
                date: item.date,
                slug: item.slug,
                content: item.content,
              })),
            );
          })
          .catch(() => console.error("Latest News Error"))
          .finally(() => setLoadingLatest(false)),
      );
      /* -------- Trending News -------- */
      // promises.push(
      //   fetchTrendingNews(baseURL)
      //     .then((trendingData) => {
      //       trendingData.sort(
      //         (a, b) => new Date(b.created_at) - new Date(a.created_at),
      //       );
      //       setTrendingNews(
      //         trendingData.slice(0, 4).map((item) => ({
      //           title: item.title,
      //           image: safeImage(baseURL, item.image),
      //           date: item.date,
      //           slug: item.slug,
      //           content: item.content,
      //         })),
      //       );
      //     })
      //     .catch((err) => console.error("Trending News Error"))
      //     .finally(() => setLoadingTrending(false)),
      // );

      promises.push(
        fetchTrendingNewsLimit(baseURL)
          .then((trendingData) => {
            setTrendingNews(
              trendingData.map((item) => ({
                title: item.title,
                image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
                date: item.date,
                slug: item.slug,
                content: item.content,
              })),
            );
          })
          .catch(() => console.error("Trending News Error"))
          .finally(() => setLoadingTrending(false)),
      );

      /* -------- Cinema News -------- */
      promises.push(
        fetchCinemaNewsLimit(baseURL)
          .then((cinemaData) => {
            setCinemaNews(
              cinemaData.map((item) => ({
                title: item.title,
                image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
                date: item.date,
                slug: item.slug,
                content: item.content,
              })),
            );
          })
          .catch((err) => console.error("Cinema News Error"))
          .finally(() => setLoadingCinema(false)),
      );

      /* -------- Meet The Person -------- */
      promises.push(
        fetchMeetPersonsLimit(baseURL)
          .then((meetData) => {
            setMeetThePerson(
              meetData.map((item) => ({
                title: item.title,
                image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
                date: item.date,
                slug: item.slug,
                content: item.content,
              })),
            );
          })
          .catch((err) => console.error("Meet Person Error"))
          .finally(() => setLoadingMeet(false)),
      );

      /* -------- More News -------- */
      // promises.push(
      //   fetchMoreNews(baseURL)
      //     .then((moreData) => {
      //       moreData.sort(
      //         (a, b) => new Date(b.created_at) - new Date(a.created_at),
      //       );
      //       setMoreNews(
      //         moreData.slice(0, 10).map((item) => ({
      //           title: item.title,
      //           image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
      //           date: item.date,
      //           slug: item.slug,
      //           content: item.content,
      //         })),
      //       );
      //     })
      //     .catch((err) => console.error("More News Error")),
      // );

      promises.push(
        fetchMoreNewsLimit(baseURL)
          .then((moreNewsData) => {
            setMoreNews(
              moreNewsData.map((item) => ({
                title: item.title,
                image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
                date: item.date,
                slug: item.slug,
                content: item.content,
              })),
            );
          })
          .catch(() => console.error("More News trending Error")),
      );

      /* -------- Banners -------- */
      promises.push(
        fetchBannersHome(baseURL)
          .then((bannerData) => {
            setBanners(
              bannerData.map((item) => ({
                image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
                link: item.link,
              })),
            );
          })
          .catch((err) => console.error("Banners Error")),
      );

      /* -------- Teasers -------- */
      promises.push(
        fetchTeasersLimit(baseURL)
          .then((teaserData) => {
            setTeasers(
              teaserData.map((item) => {
                const videoId = getYouTubeId(item.video_url);
                return {
                  title: item.video_title,
                  image: videoId
                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    : null,
                  youtubeId: videoId,
                  date: item.published_date,
                  slug: "#",
                };
              }),
            );
          })
          .catch((err) => console.error("Teasers Error")),
      );

      /* -------- Ads -------- */
      promises.push(
        fetchSquareAds(baseURL)
          .then((squareAdsData) => {
            setSquareAds(
              squareAdsData
                .filter(
                  (ad) =>
                    ad.status === true &&
                    ad.page_type?.toLowerCase() === "home",
                )
                .sort((a, b) => a.order - b.order)
                .slice(0, 3)
                .map((ad) => ({
                  image: `${baseURL}/${ad.image.replace(/\\/g, "/")}`,
                  link: ad.link || "#",
                  showContact: ad.show_contact,
                  title: ad.title,
                })),
            );
          })
          .catch((err) => console.error("Square Ads Error")),
      );

      promises.push(
        fetchBannerAds(baseURL)
          .then((bannerAdsData) => {
            setBannerAds(
              bannerAdsData
                .filter(
                  (ad) =>
                    ad.status === true &&
                    ad.page_type?.toLowerCase() === "home",
                )
                .sort((a, b) => a.order - b.order)
                .slice(0, 5)
                .map((ad) => ({
                  image: `${baseURL}/${ad.image.replace(/\\/g, "/")}`,
                  link: ad.link,
                  showContact: ad.show_contact,
                  title: ad.title,
                })),
            );
          })
          .catch((err) => console.error("Banner Ads Error")),
      );

      await Promise.all(promises);
      setLoading(false);
    }

    loadData();
  }, [baseURL]);

  if (loading)
    return (
      <>
        <CustomLoader />
      </>
    );
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 items-start">
          {/* HERO */}
          <div className="lg:col-span-3">
            <Hero banners={banners} />
          </div>

          <div className="mt-6 xl:mt-0 hidden xl:block">
            {/* <NewsColumn
              title="TRENDING NEWS"
              items={trendingNews}
              trending={true}
              loading={loadingTrending}
              category="trending-news"
            /> */}

            <div>
              <VideoVerticalSlider
                title="Trailers And Previews"
                items={teasers}
                autoSlide={true}
                delay={2500}
                loading={loading}
              />
            </div>
          </div>
          <InlineGoogleAd slot="9731498203" />
        </div>

        {/* ---------- Horizontal Ad under Banner & Trending ---------- */}
        <InlineGoogleAd slot="2236151560" />
      </section>
      <section className="w-full">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="mb-6 xl:mb-0">
            <NewsColumn
              title="LATEST NEWS"
              items={latestNews}
              loading={loadingLatest}
              category="news"
            />
          </div>
          <div className="mb-6 lg:mb-0">
            <NewsColumn
              title="Cinema News"
              items={cinemaNews}
              loading={loadingCinema}
              category="cinema-news"
            />
          </div>
          <div className="mb-6 lg:mb-0">
            <NewsColumn
              title="Meet The Person"
              items={meetThePerson}
              loading={loadingMeet}
              category="meet-person"
            />
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ================= LEFT COLUMN (Content 8/12) ================= */}
        <div className="lg:col-span-9 flex flex-col gap-5">
          <InlineGoogleAd slot="7488478241" />
          <div className="xl:hidden my-5">
            <MediaSlider
              title="Trailers And Previews"
              video={true}
              items={teasers}
            />
            <div className="flex justify-end mt-2">
              <Link
                to="/teaserandpromo"
                className="flex items-center gap-1 text-sm font-bold text-brand-red hover:text-brand-dark transition-colors"
              >
                View More <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          {bannerAds && <FullWidthAd ads={bannerAds} />}

          <div className="my-6 lg:my-0">
            <div className="mb-6">
              <MediaSlider
                title="TRENDING NEWS"
                items={trendingNews}
                loading={false}
                trending={true}
              />
            </div>
            <MediaSlider title="More News" items={moreNews} loading={false} />
            <div className="flex justify-end mt-2">
              <Link
                to="/more"
                className="flex items-center gap-1 text-sm font-bold text-brand-red hover:text-brand-dark transition-colors"
              >
                View More <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          {/* <div>
            <MediaSlider
              title="Teaser And Promo"
              video={true}
              items={teasers}
            />
            <div className="flex justify-end mt-2">
              <Link
                to="/teaserandpromo"
                className="flex items-center gap-1 text-sm font-bold text-brand-red hover:text-brand-dark transition-colors"
              >
                View More <ArrowRight size={16} />
              </Link>
            </div>
          </div> */}
        </div>

        {/* ================= RIGHT COLUMN (Sidebar 4/12) ================= */}
        <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 self-start lg:mt-8">
          <InlineGoogleAd slot="9923069891" />
          <AdList ads={squareAds} />
        </aside>
      </div>
    </main>
  );
}

export default Home;
