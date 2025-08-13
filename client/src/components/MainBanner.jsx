import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="relative w-full  overflow-hidden">
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="w-full hidden md:block object-cover"
      />
      <img
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="w-full md:hidden object-cover"
      />

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center px-4 md:px-16 lg:px-24 pb-24 md:pb-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left leading-tight max-w-[20rem] md:max-w-[30rem] lg:max-w-[38rem] text-gray-800">
          Freshness You Can Trust,
          <br className="hidden md:block" />
          Savings You Will Love!
        </h1>

        <div className="flex flex-col sm:flex-row items-center mt-6 gap-4 sm:gap-6 font-medium">
          <Link
            to="/products"
            className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded-full text-white cursor-pointer text-sm md:text-base"
          >
            Shop Now
            <img
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>

          <Link
            to="/deals"
            className="hidden sm:flex items-center gap-2 px-7 md:px-9 py-3 transition rounded-full cursor-pointer text-sm md:text-base group"
          >
            Explore deals
            <img
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              src={assets.black_arrow_icon}
              alt="arrow icon"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
