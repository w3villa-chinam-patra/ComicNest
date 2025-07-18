import PricingSection from "../../../components/PricingSection";
import FeaturedPublishers from "./FeaturedPublishers";

const HeroSection = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-28">
      <div className="intro relative h-screen w-[99.9%] overflow-hidden">
        <div className="absolute inset-0 scale-125 sm:scale-100">
          <img src="/images/comic-background.png" alt="comic background" className="h-full w-full" />
        </div>
        <div className="relative top-1/2 -translate-y-1/2 flex justify-center items-center">
          <img
            src="/images/comic-blast.png"
            alt="comic blast image"
            className="w-xl"
          />
          <div className="absolute -rotate-12 top-[35%] left-[50%] -translate-x-1/2 font-comic text-7xl sm:text-9xl md:text-[170px] text-stroke tracking-wider text-nowrap">
            Comic Nest
          </div>
        </div>
      </div>
      <FeaturedPublishers />
      <PricingSection />
    </div>
  );
};

export default HeroSection;
