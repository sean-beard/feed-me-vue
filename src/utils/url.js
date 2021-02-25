export const getParameterByName = (url, name) => {
  const match = RegExp("[?&]" + name + "=([^&]*)").exec(url);
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
};
