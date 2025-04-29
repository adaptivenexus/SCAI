"use client";
// import Swiper core and required modules
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  FreeMode,
  Autoplay,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/free-mode";
import TestimonialCard from "./TestimonialCard";

export default () => {
  const reviews = [
    {
      name: "Fazal Dasankop",
      role: "President",
      firm: "Muslim Chamber of Commerce",
      url: "https://www.muslimchamber.com/",
      review:
        "The Muslim Chamber eCommerce website is a perfect blend of professionalism and functionality, providing a seamless shopping experience with an intuitive interface and easy navigation. The site loads quickly, offers secure transactions, and ensures businesses and customers can connect effortlessly. Its modern design and well-structured layout make browsing products and services smooth, enhancing the overall user experience.",
    },
    {
      name: "Amir Khan",
      role: "Founder",
      firm: "Blue-sky innovative",
      url: "https://bluesky-innovate.com/",

      review:
        "The website is expertly designed with a seamless user experience, intuitive navigation, and optimized performance. Its modern interface ensures efficient access to critical information, enhancing engagement and usability for all visitors",
    },

    {
      name: "Tamseel Pathan",
      role: "Director",
      firm: "SCAI",
      url: "https://www.sc.ai/",

      review:
        "This document management solution is a game-changer, leveraging advanced AI and OCR technology to streamline data extraction, categorization, and retrieval with exceptional accuracy. By automating manual processes, it significantly enhances efficiency, reduces errors, and improves searchability, making document handling effortless and secure.",
    },
  ];

  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y, FreeMode, Autoplay]}
      slidesPerView={1}
      spaceBetween={40}
      navigation={{
        nextEl: ".next-btn-swiper",
        prevEl: ".prev-btn-swiper",
      }}
      loop={true}
      pagination={{ enabled: false }}
      autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
      autoHeight={true}
    >
      {reviews.map((review, index) => (
        <SwiperSlide key={index} className="!h-full">
          <TestimonialCard
            name={review.name}
            role={review.role}
            firm={review.firm}
            url={review.url}
            review={review.review}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
