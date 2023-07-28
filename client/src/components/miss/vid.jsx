import React from 'react';
import video from '../../assets/lose.mp4';
const MissVid = () => {
    return (
      <div className='container justify-content-center'>
        <video src= {video} muted autoPlay playsInline loop style={{ width: '100%', height: '100%' }}/>
    
          </div> 
    )
  };
  
  export default MissVid;