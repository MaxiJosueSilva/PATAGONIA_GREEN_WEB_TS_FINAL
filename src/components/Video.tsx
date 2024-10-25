import React, { useEffect, useState } from 'react';

interface VideoProps {
  camaraip: string;
}

const Video: React.FC<VideoProps> = ({ camaraip }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (camaraip) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://172.40.20.114:3000';
      const user = import.meta.env.VITE_VIDEO_USER || 'admin';
      const password = import.meta.env.VITE_VIDEO_PASSWORD || 'Sussex731';
      const url = `${backendUrl}/video_feed?url=${camaraip}&user=${user}&password=${password}`;
      setVideoUrl(url);
    }
  }, [camaraip]);

  useEffect(() => {
    const checkVideoLoad = () => {
      const videoElement = document.createElement('img');
      videoElement.onload = () => {
        setError('');
      };
      videoElement.onerror = () => {
        setError('Error al cargar el video.');
      };
      videoElement.src = videoUrl;
    };

    if (videoUrl) {
      checkVideoLoad();
    }
  }, [videoUrl]);

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
      {error && <p>{error}</p>}
    </div>
  );
};

export default Video;