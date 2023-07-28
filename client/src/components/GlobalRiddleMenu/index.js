import React, { useRef, useState, useEffect } from 'react';
import Webcam from "react-webcam";
import './style.css';
import { TypeAnimation } from 'react-type-animation';
import AuthService from '../../utils/auth';
import WinVid from '../win/vid';
import MissVid from '../miss/vid';
const hostServer = 'https://pure-meadow-61870-2db53a3c769f.herokuapp.com';


function GlobalRiddleMenu({ onWebcamVisibilityChange, props }) {
  const webcamRef = useRef(null);
  const [image, setImage] = useState("");
  const [facingMode, setFacingMode] = useState('user');
  const [isWebcamVisible, setIsWebcamVisible] = useState(false);
  const [roomRiddle, setRoomRiddle] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [isAnswerIncorrect, setIsAnswerIncorrect] = useState(false);

  useEffect(() => {
    // Call the function passed in through the props whenever isWebcamVisible changes
    onWebcamVisibilityChange(isWebcamVisible);
  }, [isWebcamVisible]);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  const hideVideo = () => {
    setIsAnswerCorrect(false);
  };

  const hideMissVideo = () => {
    setIsAnswerIncorrect(false);
  };


  const handleUpload = async () => {
    if (image) {
      const blob = await fetch(image).then(res => res.blob());

      const formData = new FormData();
      formData.append('file', blob, 'photo.jpg');

      try {
        const res = await fetch(`${hostServer}/api/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();
        const answerResult = data.message;
        if (answerResult === "Correct") {
          setIsAnswerCorrect(true);
        } else {
          setIsAnswerIncorrect(true)
        };



      } catch (error) {
        console.log('Error:', error);
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prevState => prevState === 'user' ? 'environment' : 'user');
  };

  const fetchRiddle = async () => {
    try {
      // Fetch rooms
      const res = await fetch(`${hostServer}/api/rooms`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const rooms = await res.json();

      // Find the 'global' room
      const globalRoom = rooms.find(room => room.roomName.toLowerCase() === 'global');

      if (!globalRoom) {
        throw new Error('Global room not found');
      }

      // Set the roomRiddle state here

      setRoomRiddle(globalRoom.currentRiddle);
      // Fetch timeLeft from server
      const timeLeft = globalRoom.timeLeft;
      console.log(timeLeft);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    fetchRiddle();
    const riddleTimerId = setInterval(() => {
      fetchRiddle();
    }, 3000);

    let countdownTimerId;
    if (timeLeft !== null) {
      countdownTimerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 3000);
    }

    return () => {
      clearInterval(riddleTimerId);
      clearInterval(countdownTimerId);
    }
  }, [timeLeft]);

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~JoinRoom~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const handlePlayNow = async () => {
    if (!AuthService.loggedIn()) {
      console.log('User not logged in');
      // redirect to signup if not logged in
      window.location.href = `${hostServer}/signup`;
      return;
    }

    try {
      // Fetch rooms
      const res = await fetch(`${hostServer}/api/rooms`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const rooms = await res.json();

      // Find the 'global' room
      const globalRoom = rooms.find(room => room.roomName.toLowerCase() === 'global');


      if (!globalRoom) {
        throw new Error('Global room not found');
      }

      // Join the global room
      const joinRes = await fetch(`${hostServer}/api/rooms/join-room/${globalRoom._id}`, {
        method: 'POST',
        credentials: 'include'
      });




      if (!joinRes.ok) {
        throw new Error('Failed to join the global room');
      }

      const joinData = await joinRes.json();
      console.log('Joined room:', joinData);
      setIsWebcamVisible(true); // Show webcam after successfully joining room
      setRoomId(globalRoom._id);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LeaveRoom~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const handleLeaveRoom = async () => {
    if (!AuthService.loggedIn() || !roomId) {
      console.log('User not logged in or not in room');
      console.log(roomId);
      return;
    }

    try {
      const leaveRes = await fetch(`${hostServer}/api/rooms/leave-room/${roomId}`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!leaveRes.ok) {
        throw new Error('Failed to leave the room');
      }

      const leaveData = await leaveRes.json();
      console.log('Left room:', leaveData);
      setRoomId(null);
      setIsWebcamVisible(false);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseImage = () => {
    setImage("");
  };

  const handleImageClick = async () => {
    try {
      await handleUpload();
      handleCloseImage();
    } catch (error) {
      console.error('Error handling image click:', error);
    }
  };

  return (
    
    <div className="container my-1">
      
      <div className="text-container">
        <h2 className="riddle-prompt">Global Riddle Prompt:</h2>
        <span className="riddle-description">
        {/* <Video3> */}
          <TypeAnimation
            key={roomRiddle}
            sequence={[
              roomRiddle
            ]}
            wrapper="span"
            cursor={true}
          />
         {/* </Video3>  */}
        </span>
        {!isWebcamVisible && (
          <button className="play-now-button play-btn" onClick={handlePlayNow}>
            Guess Now!
          </button>
        )}
      </div>

      <div className="cam-container">
        {isAnswerCorrect ? (
          <div onClick={hideVideo}>
            <WinVid />
          </div>
        ) : isAnswerIncorrect ? (
          <div onClick={hideMissVideo}>
            <MissVid />
          </div>
        ) : (
          <>
            {isWebcamVisible && (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode }}
                  onClick={handleCapture}
                />
                <div className="profile-stats media-btn-container">             
                  <button onClick={switchCamera} className="media-btn">Switch Camera</button>
                  <button onClick={handleLeaveRoom} className="media-btn">Leave Room</button>
                  </div>               
                {
                  image && (
                    <div className="imageSubmit">
                      <img onClick={handleImageClick} src={image} alt="Captured" className="image" />
                      <div className="newPhoto-btn">
                        <button onClick={handleCloseImage} id='newPhoto' className="media-btn profile-stats">New Photo</button>
                      </div>
                    </div>
                  )
                }
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default GlobalRiddleMenu;