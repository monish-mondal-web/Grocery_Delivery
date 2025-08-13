import BestSellers from "../components/BestSellers";
import BottomBanner from "../components/BottomBanner";
import Categories from "../components/Categories";
import MainBanner from "../components/MainBanner";
import Newslater from "../components/Newslater";
import Navbar from "../components/navbar";
import React from "react";


const Home = () => {
  return (
    <div className="mt-10">
      <MainBanner/>
      <Categories/>
      <BestSellers/>
      <BottomBanner/>
      <Newslater/>
      
    </div>
  );
};

export default Home;
