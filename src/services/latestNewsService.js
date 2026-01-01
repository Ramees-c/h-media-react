export const fetchLatestNews = async (baseURL) => {
  try {
    const res = await fetch(`${baseURL}/news/`);
    if (!res.ok) throw new Error("Failed to fetch latest news");
    return await res.json();
  } catch (err) {
    console.error("Error fetching latest news");
    return [];
  }
};

export const addLatestNews = async (baseURL, formData) => {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`${baseURL}/admin/news`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to add news");
    }
    return await res.json();
  } catch (err) {
    console.error("add latest news error");
    throw err;
  }
};

export const updateLatestNews = async (baseURL, newsId, formData) => {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`${baseURL}/admin/news/${newsId}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to update news");
    }
    return await res.json();
  } catch (err) {
    console.error("failed to update latest news");
    throw err;
  }
};

export const deleteLatestNews = async (baseURL,newsId) => {
   const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`${baseURL}/admin/news/${newsId}`, {
      method: "DELETE",
        headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to delete news");
    }
    return await res.json();
  } catch (err) {
    console.error("failed to delete latest news");
    throw err;
  }
};
