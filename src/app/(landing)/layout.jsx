import Footer from "@/components/Footer";
import Header from "@/components/Header";

const LandingLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="">{children}</main>
      <Footer />
    </>
  );
};
export default LandingLayout;
