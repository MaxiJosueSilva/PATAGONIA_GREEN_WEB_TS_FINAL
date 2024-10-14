import React, { useEffect, useState } from 'react';

interface VideoProps {
  camaraip: string;
}

const Video: React.FC<VideoProps> = ({ camaraip }) => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (camaraip) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const user = import.meta.env.VITE_VIDEO_USER || 'admin';
      const password = import.meta.env.VITE_VIDEO_PASSWORD || 'Sussex731';
      const url = `${backendUrl}/video_feed?url=${camaraip}&user=${user}&password=${password}`;
      setVideoUrl(url);
    }
  }, [camaraip]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {videoUrl ? (
        <img
          src={videoUrl}
          alt="Cámara"
          style={{ width: '100%', height: 'auto' }}
        />
      ) : (
        <p>Cargando video...</p>
      )}
    </div>
  );
};

export default Video;