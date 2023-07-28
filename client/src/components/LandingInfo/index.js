import React from 'react';
import Video from './vid';

function LandingInfo(props) {

  return (

    <div className="container my-1">
      
      <div className="button-container">
        {/* <button className="custom-button">SOLO</button>
        <button className="custom-button">GLOBAL</button> */}
      </div>

      <div className="text-container">
      
        <Video></Video>
        <p className="description">Bring Me! is the world's first real-life treasure hunt where you solve riddles, and venture out to take pictures of the answers to get points!</p>
      </div>

    </div>
  );
}

export default LandingInfo;
