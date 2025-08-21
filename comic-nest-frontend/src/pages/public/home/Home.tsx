import Footer from "./Footer";
import Header from "./Header";
import HeroSection from "./HeroSection";

const Home = () => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default Home;
