import { FaArrowRight } from "react-icons/fa6";
import Heading from "../AccentComponents/Heading";
import Image from "next/image";
import Link from "next/link";

const Working = () => {
  return (
    <section className="bg-secondary-gradient py-14">
      <div className="xl:max-w-[1280px] px-4 mx-auto space-y-10">
        {/* Heading */}
        <div className="flex flex-col items-center gap-5">
          <Heading>Function</Heading>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="heading-4 sm:heading-3 md:heading-2 text-foreground">
              How It Works
            </h2>
            <p className="subtitle-text text-primary">
              Get started in minutes with our simple four-step process
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col xl:flex-row items-center gap-2 w-full">
          <Link href="/working/upload-doc" className="flex flex-col items-center bg-background px-5 py-7 rounded-lg flex-1 md:w-80 xl:w-auto w-full hover:scale-[1.02] duration-300 gap-2">
            <div className="">
              <Image src={"/step1.png"} alt={"Step 1"} width={66} height={66} />
            </div>
            <div className="flex flex-col gap-2">
              <h5 className="heading-5 text-center">Upload Documents</h5>
              <p className="body-text text-secondary-foreground text-center">
                Drag and drop or select files from your device
              </p>
            </div>
          </Link>
          <div>
            <FaArrowRight
              size={30}
              className="text-primary rotate-90 xl:rotate-0"
            />
          </div>
          <Link href="/working/ai-processing" className="flex flex-col items-center bg-background px-5 py-7 rounded-lg flex-1 md:w-80 xl:w-auto w-full hover:scale-[1.02] duration-300 gap-2">
            <div className="">
              <Image src={"/step2.png"} alt={"Step 2"} width={66} height={66} />
            </div>
            <div className="flex flex-col gap-2">
              <h5 className="heading-5 text-center">AI Processing</h5>
              <p className="body-text text-secondary-foreground text-center">
                Our AI analyzes and extracts key information
              </p>
            </div>
          </Link>
          <div>
            <FaArrowRight
              size={30}
              className="text-primary rotate-90 xl:rotate-0"
            />
          </div>
          <Link href="/working/smart-organization" className="flex flex-col items-center bg-background px-5 py-7 rounded-lg flex-1 md:w-80 xl:w-auto w-full hover:scale-[1.02] duration-300 gap-2">
            <div className="">
              <Image src={"/step3.png"} alt={"Step 3"} width={66} height={66} />
            </div>
            <div className="flex flex-col gap-2">
              <h5 className="heading-5 text-center">Smart Organization</h5>
              <p className="body-text text-secondary-foreground text-center">
                Documents are automatically categorized
              </p>
            </div>
          </Link>
          <div>
            <FaArrowRight
              size={30}
              className="text-primary rotate-90 xl:rotate-0"
            />
          </div>
          <Link href="/working/easy-access" className="flex flex-col items-center bg-background px-5 py-7 rounded-lg flex-1 md:w-80 xl:w-auto w-full hover:scale-[1.02] duration-300 gap-2">
            <div className="">
              <Image src={"/step4.png"} alt={"Step 4"} width={66} height={66} />
            </div>
            <div className="flex flex-col gap-2">
              <h5 className="heading-5 text-center">Easy Access</h5>
              <p className="body-text text-secondary-foreground text-center">
                Find any document instantly with smart search
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default Working;
