"use client";

import Image from "next/image";
import { FaCirclePlay } from "react-icons/fa6";
import VideoModel from "./VideoModel";
import { useState } from "react";

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section
      className="h-[calc(100vh-72px)] md:h-[calc(100vh-76px)] flex items-center bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: " url('/Hero.png')" }}
    >
      <div className="xl:max-w-[1280px] max-xl:px-4 mx-auto space-y-10">
        <div className="flex flex-col gap-6 items-center">
          <h1 className="heading-3 sm:heading-2 md:heading-1 text-foreground text-center">
            <span className="bg-primary-gradient-reverse text-transparent bg-clip-text">
              Revolutionize
            </span>{" "}
            Document
            <br />
            Management with AI.
          </h1>
          <p className="subtitle-text text-secondary-foreground text-center w-full md:w-[626px]">
            Secure. Smart. Simple. Transform your document workflow with
            AI-powered classification and organization.
          </p>
        </div>
        <div className="flex items-center gap-0 mx-auto w-full sm:w-max">
          <button className="body-text text-background bg-primary-gradient rounded-l-full py-4 flex-1 sm:w-[200px] block hover:opacity-85 duration-200">
            Start Free Trial
          </button>
          <button
            onClick={() => setShowVideo(true)}
            className="flex items-center gap-2 body-text text-foreground bg-background rounded-r-full py-4 justify-center flex-1 sm:w-[200px] border border-[#D8D8D8] hover:opacity-85 duration-200"
          >
            <FaCirclePlay size={24} /> <span>Watch Demo</span>
          </button>
        </div>
        <Image
          src={"/Hero-Image.png"}
          alt="HeroImage"
          width={1280}
          height={288}
          priority
          className=""
        />
      </div>
      {showVideo && <VideoModel setShowVideo={setShowVideo} />}
    </section>
  );
};
export default Hero;
