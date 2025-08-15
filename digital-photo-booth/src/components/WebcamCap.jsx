import React, { useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

const WebcamCap = () => {
  const [devices, setDevices] = useState([]);
  const [constraints, setConstraints] = useState(null);

  const handleDevices = useCallback((mediaDevices) => {
    const cams = mediaDevices.filter(({ kind }) => kind === 'videoinput');
    setDevices(cams);

    if (cams.length > 0) {
      setConstraints({
        deviceId: cams[0].deviceId, // front camera first
        facingMode: 'user', // try front cam, fallback to back automatically
        aspectRatio: 16 / 9,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      });
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Available Cameras</h1>
      <div className="row g-4">
        {devices.map((device, key) => (
          <div key={key} className="col-12 col-sm-6 col-lg-4">
            <div
              className="card h-100 border-0"
              style={{
                background: 'linear-gradient(145deg, rgba(250,247,243,0.9) 0%, rgba(240,228,211,0.9) 100%)'
              }}
            >
              <div className="card-body text-center">
                <Webcam
                  audio={false}
                  playsInline
                  muted
                  videoConstraints={{
                    deviceId: device.deviceId,
                    facingMode: key === 0 ? 'user' : 'environment',
                    aspectRatio: 16 / 9,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                  }}
                  className="img-fluid rounded-3"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '300px',
                    objectFit: 'cover'
                  }}
                />
                <h5 className="card-title mt-3">
                  {device.label || `Camera ${key + 1}`}
                </h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebcamCap;
