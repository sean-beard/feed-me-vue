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
