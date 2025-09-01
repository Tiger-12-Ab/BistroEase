import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface Review {
  id: number;
  user: string;
  dish: string;
  rating: number;
  review_text: string;
  featured: boolean;
  created_at: string;
}

const ReviewTable = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get("/api/admin/reviews", { withCredentials: true });
      if (Array.isArray(data)) setReviews(data);
      else if (data && Array.isArray(data[0])) setReviews(data[0]);
      else setReviews([]);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm(t("review.deleteConfirm"))) return;
    await axios.delete(`/api/admin/reviews/${id}`, { withCredentials: true });
    fetchReviews();
  };

  const toggleFeature = async (id: number) => {
    await axios.put(`/api/admin/reviews/${id}/feature`, {}, { withCredentials: true });
    fetchReviews();
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex gap-1">
        {[...Array(fullStars)].map((_, i) => <span key={"f"+i}>⭐</span>)}
        {halfStar && <span>🌗</span>}
        {[...Array(emptyStars)].map((_, i) => <span key={"e"+i}>☆</span>)}
      </div>
    );
  };

  return (
    <div className="flex flex-col p-4 sm:p-6 bg-bg-light dark:bg-bg-dark min-h-screen">
      <h2 className="text-2xl font-bold mb-4 sm:mb-6 text-bg-dark dark:text-bg-light">
        {t("review.title")}
      </h2>

      {/* Mobile cards (sm/md) */}
      <div className="flex flex-col gap-4 lg:hidden">
        {reviews.length > 0 ? reviews.map((r) => (
          <div key={r.id} className="bg-primary dark:bg-accent rounded-lg p-4 shadow">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">{r.user}</span>
              <span className="text-sm text-text-secondary dark:text-text-secondary">
                {new Date(r.created_at).toLocaleString()}
              </span>
            </div>
            <div className="mb-1 font-medium">{r.dish}</div>
            <div className="mb-1">{renderStars(r.rating)}</div>
            <div className="mb-2">{r.review_text}</div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => deleteReview(r.id)}
                className="px-2 py-1 rounded bg-highlight text-bg-light hover:opacity-90 text-sm"
              >
                {t("review.delete")}
              </button>
              <button
                onClick={() => toggleFeature(r.id)}
                className="px-2 py-1 rounded bg-accent text-bg-light hover:opacity-90 text-sm"
              >
                {r.featured ? t("review.unfeature") : t("review.feature")}
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center text-text-secondary dark:text-text-secondary p-4">
            {t("review.noReviews")}
          </div>
        )}
      </div>

      {/* Desktop table (lg+) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full w-full table-auto border-collapse rounded-lg">
          <thead className="bg-secondary dark:bg-secondary-dark">
            <tr>
              <th className="p-3 text-left">{t("review.user")}</th>
              <th className="p-3 text-left">{t("review.dish")}</th>
              <th className="p-3 text-left">{t("review.rating")}</th>
              <th className="p-3 text-left">{t("review.text")}</th>
              <th className="p-3 text-left">{t("review.createdAt")}</th>
              <th className="p-3 text-left">{t("review.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? reviews.map((r) => (
              <tr key={r.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3">{r.user}</td>
                <td className="p-3">{r.dish}</td>
                <td className="p-3">{renderStars(r.rating)}</td>
                <td className="p-3">{r.review_text}</td>
                <td className="p-3">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => deleteReview(r.id)}
                    className="px-3 py-1 rounded bg-highlight text-bg-light hover:opacity-90 transition"
                  >
                    {t("review.delete")}
                  </button>
                  <button
                    onClick={() => toggleFeature(r.id)}
                    className="px-3 py-1 rounded bg-accent text-bg-light hover:opacity-90 transition"
                  >
                    {r.featured ? t("review.unfeature") : t("review.feature")}
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center p-6 text-text-secondary dark:text-text-secondary">
                  {t("review.noReviews")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewTable;
