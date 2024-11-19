import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CardMedia } from '@mui/material'; // Assuming you're using Material-UI for CardMedia
import { Link } from 'react-router-dom'; // Assuming you're using React Router

const PersonalInfo = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/personalinfformation/');
        console.log(response.data); // Check the API response structure
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div>
      <h2>Image Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.map((img) => (
          <div key={img.id} style={{ margin: '10px' }}>
            <Link to={'/img/' + img.id}> {/* Link to image details */}
              <CardMedia
                component="img"
                src={img.profile_photo} // Assuming img.profile_photo is a valid image URL
                alt="Uploaded"
                style={{ width: '150px', height: '150px' }}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfo;
