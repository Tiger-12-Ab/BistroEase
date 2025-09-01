import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaStar } from "react-icons/fa";

interface Review {
  id: number;
  name: string;
  message: string;
  rating: number; // 1 to 5
}

export default function ReviewsCarousel() {
  const reviews: Review[] = [
    {
      id: 1,
      name: "John Doe",
      message: "Amazing service! Highly recommend.",
      rating: 5,
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Very satisfied with the products.",
      rating: 4,
    },
    {
      id: 3,
      name: "Ali Rahman",
      message: "Quick delivery and excellent support!",
      rating: 5,
    },
  ];

  return (
    <div className="py-16 bg-bg-light dark:bg-bg-dark">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-bg-dark dark:text-bg-light">
        Customer Reviews
      </h2>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        className="max-w-4xl mx-auto px-4"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <div className="bg-primary dark:bg-accent shadow-lg rounded-lg p-6 sm:p-8 text-center flex flex-col items-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      i < review.rating
                        ? "text-highlight"
                        : "text-bg-light dark:text-bg-dark"
                    }`}
                  />
                ))}
              </div>
              <p className="text-text-secondary dark:text-text-secondary text-sm sm:text-base mb-4 sm:mb-6">
                {review.message}
              </p>
              <h4 className="font-semibold text-text-primary dark:text-text-primary text-base sm:text-lg">
                {review.name}
              </h4>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
