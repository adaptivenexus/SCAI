import { FaArrowsRotate, FaBrain, FaCloud } from "react-icons/fa6";
import Heading from "../AccentComponents/Heading";
import FeatureCard from "./FeatureCard";
import { FaFileAlt, FaShieldAlt } from "react-icons/fa";

const Features = () => {
  const data = [
    {
      id: 1,
      title: "AI-Powered Classification",
      icon: <FaBrain size={26} />,
      description:
        "Automatically categorize and tag documents using advanced machine learning algorithms",
    },
    {
      id: 2,
      title: "OCR Integration",
      icon: <FaFileAlt size={26} />,
      description:
        "Extract text from scanned documents with high accuracy and searchable content",
    },
    {
      id: 3,
      title: "Cloud Storage",
      icon: <FaCloud size={26} />,
      description:
        "Access your documents anywhere, anytime with secure cloud storage and backup",
    },
    {
      id: 4,
      title: "Bank-Grade Security",
      icon: <FaShieldAlt size={26} />,
      description:
        "Enterprise-level encryption and security protocols to protect your sensitive data",
    },
    {
      id: 5,
      title: "Real-time Sync",
      icon: <FaArrowsRotate size={26} />,
      description:
        "Automatic synchronization across all your devices and team members",
    },
    {
      id: 6,
      title: "Advanced Search and Retrieval",
      icon: <FaFileAlt size={26} />,
      description:
        "Efficiently search and retrieve documents based on keywords and metadata",
    },
  ];

  return (
    <section>
      <div className="xl:max-w-[1280px] px-4 mx-auto space-y-10">
        <div className="flex flex-col items-center gap-5">
          <Heading>Features</Heading>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="heading-4 sm:heading-3 md:heading-2 text-foreground">
              Powerful Features for Modern Document Management
            </h2>
            <p className="subtitle-text text-secondary-foreground">
              Everything you need to manage your documents efficiently and
              securely
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col md:flex-row gap-5 w-full">
            {data.slice(0, 3).map((item) => (
              <FeatureCard
                key={item.id}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-5 w-full">
            {data.slice(3, 6).map((item) => (
              <FeatureCard
                key={item.id}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Features;
