import store from "../store";

export const get = async (path, opts = { useAuth: true }) => {
  const response = await fetch(`http://localhost:4001${path}`, {
    method: "GET",
    headers: opts.useAuth
      ? {
          Authorization: `Bearer ${store.getters.authToken}`,
        }
      : {},
  });

  return response.json();
};
