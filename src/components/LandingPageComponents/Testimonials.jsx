import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Heading from "../AccentComponents/Heading";
import Carousel from "./Carousel";

const Testimonials = () => {
  return (
    <section>
      <div className="xl:max-w-[1280px] px-4 mx-auto space-y-10">
        <div className="flex flex-col items-center gap-5 w-full">
          <Heading>Testimonials</Heading>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="heading-4 sm:heading-3 md:heading-2 text-foreground">
              See What Our Customers Love About Us
            </h2>
            <p className="subtitle-text text-secondary-foreground">
              Explore the unique stories and feedback from our users, showcasing
              the impact
              <br />
              and versatility of our platform.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-6 w-full">
          <button type="button" className="prev-btn-swiper">
            <FaChevronLeft className="text-3xl md:text-6xl text-primary" />
          </button>

          <Carousel />

          <button type="button" className="next-btn-swiper">
            <FaChevronRight className="text-3xl md:text-6xl text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
