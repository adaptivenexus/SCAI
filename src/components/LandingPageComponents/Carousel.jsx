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
    >
      <SwiperSlide>
        <TestimonialCard />
      </SwiperSlide>

      <SwiperSlide>
        <TestimonialCard />
      </SwiperSlide>

      <SwiperSlide>
        <TestimonialCard />
      </SwiperSlide>
    </Swiper>
  );
};
