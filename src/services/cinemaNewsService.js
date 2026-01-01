export async function fetchCinemaNews(baseURL) {
  const res = await fetch(`${baseURL}/cinema-news/`);
  if (!res.ok) throw new Error("Failed to load cinema news");
  return await res.json();
}

export async function addCinemaNews(baseURL, formData) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${baseURL}/admin/cinema-news/`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const out = await res.json();
  if (!res.ok) throw new Error(out.detail || "Failed to add cinema news");
  return out;
}

export async function updateCinemaNews(baseURL, id, formData) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${baseURL}/admin/cinema-news/${id}`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const out = await res.json();
  if (!res.ok) throw new Error(out.detail || "Failed to update cinema news");
  return out;
}

export async function deleteCinemaNews(baseURL, id) {
  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch(`${baseURL}/admin/cinema-news/${id}`, {
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
    console.error("Error deleting cinema news");
  }
}
