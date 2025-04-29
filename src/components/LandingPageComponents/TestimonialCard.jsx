import Image from "next/image";
import Link from "next/link";

const TestimonialCard = ({ name, url, review, role, firm }) => {
  return (
    <Link
      href={url}
      target="_blank"
      className=" md:p-16 flex flex-col justify-center gap-7 bg-primary-gradient p-16 rounded-[100px] shadow-md text-accent-secondary  w-full h-full "
    >
      <p className="subtitle font-semibold md:heading-5 text-white">{review}</p>
      <div className="flex items-center gap-2 justify-between">
        <div className="space-y-1">
          <h5 className="body-text md:subtitle-text text-white">{name}</h5>
          <p className="body-text text-white/70">
            {role}, {firm}
          </p>
        </div>
        <div>
          <Image
            src={"/quote.svg"}
            width={96}
            height={62}
            alt={"Quote"}
            className="w-16 md:w-auto drop-shadow-lg rotate-180"
          />
        </div>
      </div>
    </Link>
  );
};
export default TestimonialCard;
