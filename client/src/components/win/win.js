import React from 'react';
import Video from './vid';

function WinScreen(props) {
  return (
    <div className='container'>
      <div className="win-screen">
        <div className="win-screen-content">
          <Video></Video>
        </div>
        <div>
          <button className="play-again-button play-btn">Another?</button>
        </div>
      </div>
    </div>
  );
}

export default WinScreen;
