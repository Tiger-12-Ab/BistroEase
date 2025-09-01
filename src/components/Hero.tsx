import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";

interface Banner {
  id: number;
  image_url: string;
  title_en: string;
  title_bn: string;
  tagline_en: string;
  tagline_bn: string;
}

export default function HeroSection() {
  const { i18n } = useTranslation();

  // Hardcoded banners
  const banners: Banner[] = [
    {
      id: 1,
      image_url: "/bg01.jpeg",
      title_en: "Welcome to Our Site",
      title_bn: "আমাদের সাইটে স্বাগতম",
      tagline_en: "Discover amazing things",
      tagline_bn: "অবিশ্বাস্য জিনিস আবিষ্কার করুন",
    },
    {
      id: 2,
      image_url: "/bg01.jpeg",
      title_en: "Quality Products",
      title_bn: "গুণমান সম্পন্ন পণ্য",
      tagline_en: "Only the best for you",
      tagline_bn: "শুধুমাত্র আপনার জন্য সেরা",
    },
    {
      id: 3,
      image_url: "/bg01.jpeg",
      title_en: "Fast Delivery",
      title_bn: "দ্রুত ডেলিভারি",
      tagline_en: "Get it when you need it",
      tagline_bn: "যখন প্রয়োজন তখন এটি পান",
    },
  ];

  return (
    <div className="relative w-full h-[90vh] bg-bg-light dark:bg-bg-dark">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className="w-full h-[90vh] bg-cover bg-center relative flex items-center justify-center"
              style={{ backgroundImage: `url(${banner.image_url})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center">
                <div className="text-center px-4">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-text-primary dark:text-text-primary drop-shadow-lg">
                    {i18n.language === "bn" ? banner.title_bn : banner.title_en}
                  </h1>
                  <p className="text-base sm:text-lg md:text-2xl font-light text-text-secondary dark:text-text-secondary drop-shadow-md">
                    {i18n.language === "bn" ? banner.tagline_bn : banner.tagline_en}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
