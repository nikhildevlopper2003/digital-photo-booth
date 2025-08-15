import React, { useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

const WebcamCap = () => {
  const [devices, setDevices] = useState([]);

  const handleDevices = useCallback((mediaDevices) => {
    setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput'));
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
                  videoConstraints={{
                    deviceId: device.deviceId,
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
