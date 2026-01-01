export async function fetchMeetPersons(baseURL) {
  const res = await fetch(`${baseURL}/meet-person/`);
  if (!res.ok) throw new Error("Failed to load Meet The Person data");
  return await res.json();
}

export async function addMeetPerson(baseURL,formData) {
   const token = localStorage.getItem("access_token");
  const res = await fetch(`${baseURL}/admin/meet-person/`, {
    method: "POST",
    body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
  });

  const out = await res.json();
  if (!res.ok) throw new Error(out.detail || "Failed to add person");
  return out;
}

export async function updateMeetPerson(baseURL,id, formData) {
   const token = localStorage.getItem("access_token");
  const res = await fetch(`${baseURL}/admin/meet-person/${id}`, {
    method: "PUT",
    body: formData,
     headers: {
        Authorization: `Bearer ${token}`,
      },
  });

  const out = await res.json();
  if (!res.ok) throw new Error(out.detail || "Failed to update person");
  return out;
}

export async function deleteMeetPerson(baseURL,id) {
   const token = localStorage.getItem("access_token");
  const res = await fetch(`${baseURL}/admin/meet-person/${id}`, {
    method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
  });

  if (!res.ok) {
    const out = await res.json();
    throw new Error(out.detail || "Failed to delete person");
  }

  return true;
}
