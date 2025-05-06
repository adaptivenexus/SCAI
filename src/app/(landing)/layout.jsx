import Footer from "@/components/Footer";
import Header from "@/components/Header";

const LandingLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
export default LandingLayout;
