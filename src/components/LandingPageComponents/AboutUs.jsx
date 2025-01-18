import Image from "next/image";
import Heading from "../AccentComponents/Heading";

const AboutUs = () => {
  return (
    <section>
      <div className="xl:max-w-[1280px] px-4 mx-auto space-y-10 flex items-center gap-10 flex-col-reverse lg:flex-row">
        <div className="flex-1">
          <Image
            src={"/AboutUs.png"}
            alt={"About Us"}
            width={628}
            height={393}
            priority
          />
        </div>
        <div className="flex-1 space-y-5 text-center lg:text-start">
          <div className="gap-5 flex flex-col items-center lg:items-start">
            <Heading>About Us</Heading>
            <div className="space-y-2">
              <h2 className="heading-4 sm:heading-3 md:heading-2">
                Know Us More
              </h2>
              <p className="subtitle-text text-primary">
                Transforming document management through innovation
              </p>
            </div>
          </div>
          <div>
            <p>
              We're a team of passionate experts combining deep technical
              knowledge with industry expertise to deliver cutting-edge document
              management solutions. With over a decade of experience, we've
              helped thousands of businesses transform their operations through
              intelligent automation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutUs;
