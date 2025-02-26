import AboutUs from "@/components/LandingPageComponents/AboutUs";
import Banner from "@/components/LandingPageComponents/Banner";
import Features from "@/components/LandingPageComponents/Features";
import Hero from "@/components/LandingPageComponents/Hero";
import Pricing from "@/components/LandingPageComponents/Pricing";
import Testimonials from "@/components/LandingPageComponents/Testimonials";
import Working from "@/components/LandingPageComponents/Working";

// icons import
import { TbMessageChatbot } from "react-icons/tb";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col gap-20 md:gap-44">
        <Hero />
        <Features />
        <Working />
        <AboutUs />
        <Testimonials />
        <Pricing />
      </div>
      <Banner />
      <button className="fixed bottom-6 right-6 w-max bg-primary-gradient p-3 rounded-full text-background border-4 border-secondary-gradient">
        <TbMessageChatbot size={40} />
      </button>
    </div>
  );
}
