import Link from "next/link";
import PrimaryButton from "../CTAs/PrimaryButton";

const Banner = () => {
  return (
    <section className="bg-primary-gradient py-20 mt-20">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="heading-4 sm:heading-3 md:heading-2 text-background">
            Start Organizing Smarter Today
          </h2>
          <p className="subtitle-text text-accent-primary">
            Try it free for 14 days. No credit card required.
          </p>
        </div>
        <Link href="/auth/signup">
        
            <PrimaryButton className={"bg-accent-primary text-foreground px-14"}>
              Get Started
            </PrimaryButton>
        </Link>
      </div>
    </section>
  );
};
export default Banner;
