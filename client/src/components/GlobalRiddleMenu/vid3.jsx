import React from 'react';
import video from '../../assets/riddlebg.mp4';

const Vid3 = () => {
  return (
    <div className='container justify-content-center' style={{ width: '100%', height: '100%', position: 'relative' }}>
      <video src={video} muted autoPlay loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
};

export default Vid3;
