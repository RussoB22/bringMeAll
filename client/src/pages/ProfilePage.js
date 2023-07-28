import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const hostServer = 'https://pure-meadow-61870-2db53a3c769f.herokuapp.com';

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const { userId } = useParams();
  
  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${hostServer}/api/users/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      setProfileData(data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const deletePhoto = async (photoId) => {
    try {
      const response = await fetch(`${hostServer}/api/media/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted photo from local state
        setProfileData(prevState => ({
          ...prevState,
          photos: prevState.photos.filter(id => id !== photoId),
        }));
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="profile-title">User Profile</h2>
      <div className="profile-info">
        <p>
          Username: <span className="profile-value">{profileData.username}</span>
        </p>
        <p>
          First Name: <span className="profile-value">{profileData.firstName}</span>
        </p>
        <p>
          Last Name: <span className="profile-value">{profileData.lastName}</span>
        </p>
        <p>
          Email: <span className="profile-value">{profileData.email}</span>
        </p>
        <p className="profile-stats">
          Games Played:{' '}
          <span className="profile-value">{profileData.gamesPlayed}</span>
          {' | '}
          Total Score:{' '}
          <span className="profile-value">{profileData.totalScore}</span>
        </p>

        <div className="profile-photos">
          <h3>User Photos</h3>
          {profileData.photos && profileData.photos.map(photoId => (
            <img
              key={photoId}
              src={`${hostServer}/api/media/${photoId}`}
              alt="user photo"
              style={{ width: '200px' }}
              onClick={() => deletePhoto(photoId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
