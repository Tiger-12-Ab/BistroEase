import React from "react";
import HeroSection from "../components/Hero"; 
import ReviewsCarousel from "../components/ReviewsCarousel"; 
import Newsletter from "../components/Newsletter"; 
import ResturantSteps from "../components/ResturantSteps"; 

export default function Home() {
  return (
    <section className="min-h-screen bg-bg-light dark:bg-bg-dark">
      {/* Hero Section */}
      <HeroSection />
      <ResturantSteps />
      <ReviewsCarousel />
      <Newsletter />
      </section>
   
  );
}
