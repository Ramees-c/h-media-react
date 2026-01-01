export async function fetchMoreNews(baseURL) {
  const res = await fetch(`${baseURL}/more-news/`);
  if (!res.ok) throw new Error("Failed to load More News");
  return await res.json();
}

export async function addMoreNews(baseURL,data) {
   const token = localStorage.getItem("access_token");
  const res = await fetch(`${baseURL}/admin/more-news/`, {
    method: "POST",
    body: data,
     headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const out = await res.json();
  if (!res.ok) throw new Error(out.detail || "Failed to add more news");
  return out;
}

export async function updateMoreNews(baseURL,id, data) {
   const token = localStorage.getItem("access_token");
  const res = await fetch(`${baseURL}/admin/more-news/${id}`, {
    method: "PUT",
    body: data,
     headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const out = await res.json();
  if (!res.ok) throw new Error(out.detail || "Failed to update more news");
  return out;
}

export async function deleteMoreNews(baseURL,id) {
   const token = localStorage.getItem("access_token");
  const res = await fetch(`${baseURL}/admin/more-news/${id}`, {
    method: "DELETE",
     headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const out = await res.json();
    throw new Error(out.detail || "Failed to delete more news");
  }

  return true;
}



