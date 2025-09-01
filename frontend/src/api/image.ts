const SERVER_URL = "http://localhost:5000";

export const getImageUrl = (url?: string | null) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http")) return url;
  return `${SERVER_URL}${url}`;
};