export const fetchArticleBySlug = async (baseURL, category, slug) => {
  try {
    const endpoints = {
      "latest-news": "news",
      "cinema-news": "cinema-news",
      "meet-person": "meet-person",
      "more-news": "more-news",
      "trending-news": "trending-news",
    };

    const endpoint = endpoints[category] || "news";
    const res = await fetch(`${baseURL}/${endpoint}/${slug}/`);

    if (!res.ok) throw new Error("Failed to fetch article");

    return await res.json();
  } catch (err) {
    console.error("Error fetching article by slug");
    return null;
  }
};


export const fetchArticleBySlugForShare = async (baseURL, category, slug) => {
  try {
    const endpoints = {
      "latest-news": "news",
      "cinema-news": "cinema-news",
      "meet-person": "meet-person",
      "more-news": "more-news",
      "trending-news": "trending-news",
    };

    const endpoint = endpoints[category] || "news";
    const res = await fetch(`${baseURL}/${endpoint}/api/${slug}/`);

    if (!res.ok) throw new Error("Failed to fetch article");

    return await res.json();
  } catch (err) {
    console.error("Error fetching article by slug");
    return null;
  }
};