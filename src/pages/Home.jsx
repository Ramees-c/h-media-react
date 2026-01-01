import React, { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";
import { fetchBanners } from "../services/bannerService";
import Hero from "../components/user/Hero";
import { fetchTrendingNews } from "../services/trendingNewsService";
import NewsColumn from "../components/user/NewsColumn";
import { fetchMoreNews } from "../services/moreNewsService";
import { fetchTeasers } from "../services/teaserPromoService";
import {
  fetchBannerAds,
  fetchSquareAds,
} from "../services/advertisementService";
import { fetchLatestNews } from "../services/latestNewsService";
import { fetchCinemaNews } from "../services/cinemaNewsService";
import { fetchMeetPersons } from "../services/meetPersonService";
import FullWidthAd from "../components/user/FullWidthAd";
import AdList from "../components/user/AdList";
import MediaSlider from "../components/user/MediaSlider";
import CustomLoader from "../components/user/CustomLoader";

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
      promises.push(
        fetchLatestNews(baseURL)
          .then((latestData) => {
            latestData.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setLatestNews(
              latestData.slice(0, 5).map((item) => ({
                title: item.title,
                image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
                date: item.date,
                slug: item.slug,
                content: item.content,
              }))
            );
          })
          .catch((err) => console.error("Latest News Error"))
          .finally(() => setLoadingLatest(false))
      );

      /* -------- Trending News -------- */
      promises.push(
        fetchTrendingNews(baseURL)
          .then((trendingData) => {
            trendingData.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setTrendingNews(
              trendingData.slice(0, 4).map((item) => ({
                title: item.title,
                image: safeImage(baseURL, item.image),
                date: item.date,
                slug: item.slug,
                content: item.content,
              }))
            );
          })
          .catch((err) => console.error("Trending News Error", err))
           .finally(() => setLoadingTrending(false))
      );

      /* -------- Cinema News -------- */
      promises.push(
        fetchCinemaNews(baseURL)
          .then((cinemaData) => {
            cinemaData.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setCinemaNews(
              cinemaData.slice(0, 5).map((item) => ({
                title: item.title,
                image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
                date: item.date,
                slug: item.slug,
                content: item.content,
              }))
            );
          })
          .catch((err) => console.error("Cinema News Error"))
           .finally(() => setLoadingCinema(false))
      );

      /* -------- Meet The Person -------- */
      promises.push(
        fetchMeetPersons(baseURL)
          .then((meetData) => {
            meetData.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setMeetThePerson(
              meetData.slice(0, 10).map((item) => ({
                title: item.title,
                image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
                date: item.date,
                slug: item.slug,
                content: item.content,
              }))
            );
          })
          .catch((err) => console.error("Meet Person Error"))
           .finally(() => setLoadingMeet(false))
      );

      /* -------- More News -------- */
      promises.push(
        fetchMoreNews(baseURL)
          .then((moreData) => {
            moreData.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setMoreNews(
              moreData.slice(0, 10).map((item) => ({
                title: item.title,
                image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
                date: item.date,
                slug: item.slug,
                content: item.content,
              }))
            );
          })
          .catch((err) => console.error("More News Error"))
      );

      /* -------- Banners -------- */
      promises.push(
        fetchBanners(baseURL)
          .then((bannerData) => {
            bannerData.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setBanners(
              bannerData.map((item) => ({
                image: `${baseURL}/${item.image.replace(/\\/g, "/")}`,
              }))
            );
          })
          .catch((err) => console.error("Banners Error"))
      );

      /* -------- Teasers -------- */
      promises.push(
        fetchTeasers(baseURL)
          .then((teaserData) => {
            const activeTeasers = teaserData
              .filter((t) => t.active_inactive)
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 10);

            setTeasers(
              activeTeasers.map((item) => {
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
              })
            );
          })
          .catch((err) => console.error("Teasers Error"))
      );

      /* -------- Ads -------- */
      promises.push(
        fetchSquareAds(baseURL)
          .then((squareAdsData) => {
            setSquareAds(
              squareAdsData
                .filter(
                  (ad) =>
                    ad.status === true && ad.page_type?.toLowerCase() === "home"
                )
                .sort((a, b) => a.order - b.order)
                .slice(0, 3)
                .map((ad) => ({
                  image: `${baseURL}/${ad.image.replace(/\\/g, "/")}`,
                  link: ad.link || "#",
                  showContact: ad.show_contact,
                  title: ad.title,
                }))
            );
          })
          .catch((err) => console.error("Square Ads Error"))
      );

      promises.push(
        fetchBannerAds(baseURL)
          .then((bannerAdsData) => {
            setBannerAds(
              bannerAdsData
                .filter(
                  (ad) =>
                    ad.status === true && ad.page_type?.toLowerCase() === "home"
                )
                .sort((a, b) => a.order - b.order)
                .slice(0, 5)
                .map((ad) => ({
                  image: `${baseURL}/${ad.image.replace(/\\/g, "/")}`,
                  link: ad.link,
                  showContact: ad.show_contact,
                  title: ad.title,
                }))
            );
          })
          .catch((err) => console.error("Banner Ads Error"))
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
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
          <div className="lg:col-span-3">
            <Hero banners={banners} />
          </div>
          <div className="mt-6 xl:mt-0">
            <NewsColumn
              title="TRENDING NEWS"
              items={trendingNews}
              trending={true}
              loading={loadingTrending}
              category="trending-news"
            />
          </div>
        </div>
      </section>

      <section className="w-full lg:py-12">
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

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ================= LEFT COLUMN (Content 8/12) ================= */}
        <div className="lg:col-span-9 flex flex-col gap-5">
          {bannerAds && <FullWidthAd ads={bannerAds} />}

          <div className="my-6 lg:my-0">
            <MediaSlider title="More News" items={moreNews} loading={false} />
          </div>
          <MediaSlider title="Teaser And Promo" video={true} items={teasers} />
        </div>

        {/* ================= RIGHT COLUMN (Sidebar 4/12) ================= */}
        <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 self-start">
          <AdList ads={squareAds} />
        </aside>
      </div>
    </main>
  );
}

export default Home;
