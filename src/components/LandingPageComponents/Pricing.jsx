import { FaCheck } from "react-icons/fa";
import Heading from "../AccentComponents/Heading";
import PrimaryButton from "../CTAs/PrimaryButton";

const Pricing = () => {
  return (
    <section>
      <div className="xl:max-w-[1280px] px-4 mx-auto space-y-10">
        <div className="flex flex-col items-center gap-5">
          <Heading>Pricing</Heading>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="heading-4 sm:heading-3 md:heading-2 text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="subtitle-text text-secondary-foreground">
              Choose the plan that's right for your business
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-center">
          {/* Starter */}
          <div className="bg-accent-secondary rounded-lg shadow-md py-5 px-7 flex flex-col gap-6">
            <div className="space-y-3">
              <h5 className="heading-5">Starter</h5>
              <p className="body-text text-secondary-foreground">
                Perfect for small teams and startups
              </p>
            </div>
            <p>
              <span className="heading-3">$29</span>
              <span className="body-text text-secondary-foreground">
                /month
              </span>
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">Up to 1,000 documents</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">Basic AI categorization</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">Standard OCR</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">Email support</p>
              </div>
            </div>
            <div className="flex-1 flex items-end">
              <PrimaryButton className={"w-full"}>Get Started</PrimaryButton>
            </div>
          </div>

          {/* Professional */}
          <div className="bg-accent-primary rounded-lg shadow-md py-5 px-7 space-y-6">
            <div className="space-y-3">
              <h5 className="heading-5">Professional</h5>
              <p className="body-text text-secondary-foreground">
                Ideal for growing businesses
              </p>
            </div>
            <p>
              <span className="heading-3">$99</span>
              <span className="body-text text-secondary-foreground">
                /month
              </span>
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">Up to 10,000 documents</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">Advanced AI categorization</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">Premium OCR</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">Priority support</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">API access</p>
              </div>
            </div>
            <div className="mt-auto">
              <PrimaryButton className={"w-full"}>Get Started</PrimaryButton>
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-accent-secondary rounded-lg shadow-md py-5 px-7 space-y-6 md:col-span-2 lg:col-span-1">
            <div className="space-y-3">
              <h5 className="heading-5">Enterprise</h5>
              <p className="body-text text-secondary-foreground">
                For large organizations
              </p>
            </div>
            <p>
              <span className="heading-3">Custom</span>
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">Unlimited documents</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">Custom AI training</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">Enterprise OCR</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">24/7 dedicated support</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <p className="body-text">Custom integration</p>
              </div>
            </div>
            <div className="mt-auto">
              <PrimaryButton className={"w-full"}>Get Started</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Pricing;
