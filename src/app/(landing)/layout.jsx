import Footer from "@/components/Footer";
import Header from "@/components/Header";

const LandingLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
export default LandingLayout;
