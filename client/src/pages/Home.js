import React, { useState } from "react";
import LandingInfo from "../components/LandingInfo";
import GlobalRiddleMenu from "../components/GlobalRiddleMenu";

const Home = () => {
  const [isWebcamVisible, setIsWebcamVisible] = useState(false);

  return (
    <div>
      {!isWebcamVisible && <LandingInfo />}
      <GlobalRiddleMenu onWebcamVisibilityChange={setIsWebcamVisible} />
    </div>
  );
};

export default Home;
