import React from 'react';
import Video from './vid';

function LoseScreen(props) {

  return (
    <div className='container'>
      <div className="win-screen">
        <div className="win-screen-content">
          <Video></Video>
        </div>
        <div>
          <button className="play-again-button play-btn">Try Again</button>
        </div>
      </div>
    </div>
  );
}

export default LoseScreen;
