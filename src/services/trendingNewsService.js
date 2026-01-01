export async function fetchTrendingNews(baseURL) {
  const res = await fetch(`${baseURL}/trending-news/`);
  if (!res.ok) throw new Error("Failed to load trending news");
  return await res.json();
}

export async function removeTrendingNews(baseURL, id) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${baseURL}/admin/trending-news/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to remove trending news");
  return await res.json();
}
