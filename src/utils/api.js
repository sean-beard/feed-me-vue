import store from "../store";

export const get = async (path, opts = { useAuth: true }) => {
  const response = await fetch(`${process.env.VUE_APP_BASE_API_URL}${path}`, {
    method: "GET",
    headers: opts.useAuth
      ? {
          Authorization: `Bearer ${store.getters.authToken}`
        }
      : {}
  });

  return response.json();
};

export const post = async (path, body) => {
  const response = await fetch(`${process.env.VUE_APP_BASE_API_URL}${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${store.getters.authToken}`
    }
  });

  return response.status !== 200
    ? { status: response.status }
    : response.json();
};

export const deletion = async (path, body) => {
  const response = await fetch(`${process.env.VUE_APP_BASE_API_URL}${path}`, {
    method: "DELETE",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${store.getters.authToken}`
    }
  });

  return response.json();
};
