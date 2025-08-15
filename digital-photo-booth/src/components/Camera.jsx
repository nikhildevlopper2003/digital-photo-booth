import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";

const videoConstraints = {
  width: 540,
  facingMode: "environment",
};

const palette = {
  primary: "#A47551",
  secondary: "#D4B499",
  accent: "#EBD9C4",
  textDark: "#5B4636",
  textLight: "#FDF7F1",
  highlight: "#C19A6B"
};

const Camera = () => {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [currentShot, setCurrentShot] = useState(0);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const navigate = useNavigate();

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const captureSinglePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return null;
    if (currentFilter) {
      return applyFilterToImage(imageSrc, currentFilter);
    }
    return imageSrc;
  };

  const applyFilterToImage = (imageSrc, filter) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        ctx.filter = filter.css || "";
        ctx.drawImage(img, 0, 0);

        if (filter.overlay) {
          if (filter.overlay.includes("url")) {
            ctx.globalCompositeOperation = "multiply";
            ctx.filter = "url(#grain)";
            ctx.drawImage(img, 0, 0);
          } else if (filter.overlay !== "none") {
            ctx.fillStyle = filter.overlay;
            ctx.globalCompositeOperation = "overlay";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }

        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  const showCountdown = async () => {
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await delay(1000);
    }
    setCountdown(null);
  };

  const captureMultiplePhotos = useCallback(async () => {
    setIsCapturing(true);
    setCapturedImages([]);
    setCurrentShot(0);

    const images = [];
    for (let i = 0; i < 3; i++) {
      setCurrentShot(i + 1);
      await showCountdown();
      const img = await captureSinglePhoto();
      if (img) images.push(img);
      setCapturedImages([...images]);
    }

    setIsCapturing(false);
    setCurrentShot(0);
  }, [currentFilter]);

  const retakePhotos = () => {
    window.location.reload();
  };

  const goToSpotifyStrip = () => {
    navigate("/spotify-card", { state: { images: capturedImages } });
  };

  const goToPolaroidStrip = () => {
    navigate("/polaroid-strip", { state: { images: capturedImages } });
  };

  const onUserMedia = () => {
    setIsCameraReady(true);
  };

  const onUserMediaError = () => {
    setIsCameraReady(false);
  };

  const handleFilterSelect = (filter) => {
    setCurrentFilter(filter);
  };

  const webcamContainerStyle = {
    background: `linear-gradient(145deg, ${palette.accent} 0%, ${palette.secondary} 100%)`,
    boxShadow: `0 4px 20px rgba(91, 70, 54, 0.15)`,
    position: "relative",
    minHeight: "405px",
    borderRadius: "1rem",
    border: `3px solid ${palette.highlight}`,
    maxWidth: "100%",
    overflow: "hidden"
  };

  if (currentFilter) {
    webcamContainerStyle.filter = currentFilter.css;
    if (
      currentFilter.overlay &&
      currentFilter.overlay !== "none" &&
      !currentFilter.overlay.includes("url")
    ) {
      webcamContainerStyle.position = "relative";
    }
  }

  return (
    <div className="container text-center py-4" style={{ color: palette.textDark }}>
      {/* Webcam View */}
      <div
        className="position-relative d-inline-block mb-4 p-3 rounded-4"
        style={{ ...webcamContainerStyle, width: "100%", maxWidth: "540px" }}
      >
        {!isCameraReady && (
          <div className="webcam-loading">
            <div
              className="spinner-border"
              style={{ color: palette.primary }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={videoConstraints}
          onUserMedia={onUserMedia}
          onUserMediaError={onUserMediaError}
          mirrored={true}
          className="border rounded-3 img-fluid"
          style={{
            borderColor: palette.textLight,
            borderWidth: "3px",
            filter: currentFilter ? currentFilter.css : "none",
            width: "100%",
            height: "auto"
          }}
        />

        {currentFilter?.overlay &&
          currentFilter.overlay !== "none" &&
          !currentFilter.overlay.includes("url") && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: currentFilter.overlay,
                mixBlendMode: "overlay",
                pointerEvents: "none"
              }}
            />
          )}

        {countdown && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(3rem, 10vw, 8rem)",
              fontWeight: "bold",
              color: palette.primary,
              textShadow: `0 0 20px ${palette.accent}`,
              zIndex: 10,
              animation: "pulse 0.5s infinite alternate"
            }}
          >
            {countdown}
          </div>
        )}

        {currentShot > 0 && (
          <div
            className="position-absolute top-0 end-0 m-2 fs-6 fs-md-5"
            style={{
              color: palette.textLight,
              backgroundColor: palette.primary,
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              fontWeight: "500"
            }}
          >
            Shot {currentShot}/3
          </div>
        )}
      </div>

      {/* Capture Buttons */}
      <div className="mb-4">
        {capturedImages.length < 3 ? (
          <button
            onClick={captureMultiplePhotos}
            disabled={isCapturing || !isCameraReady}
            className="btn btn-lg w-100 w-md-auto"
            style={{
              backgroundColor: isCapturing ? palette.secondary : palette.primary,
              borderColor: palette.primary,
              color: palette.textLight
            }}
          >
            {isCapturing
              ? `Capturing... (${currentShot}/3)`
              : "Capture"}
          </button>
        ) : (
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button
              onClick={goToSpotifyStrip}
              className="btn btn-lg w-100 w-md-auto"
              style={{
                backgroundColor: palette.highlight,
                borderColor: palette.highlight,
                color: palette.textLight
              }}
            >
              Generate Spotify Strip
            </button>
            <button
              onClick={goToPolaroidStrip}
              className="btn btn-lg w-100 w-md-auto"
              style={{
                backgroundColor: palette.primary,
                borderColor: palette.primary,
                color: palette.textLight
              }}
            >
              Generate Polaroid Memory
            </button>
            <button
              onClick={retakePhotos}
              className="btn btn-lg w-100 w-md-auto"
              style={{
                backgroundColor: palette.secondary,
                borderColor: palette.secondary,
                color: palette.textDark
              }}
            >
              Retake
            </button>
          </div>
        )}
      </div>

      {/* Filters Component */}
      <Filters
        onFilterSelect={handleFilterSelect}
        currentFilter={currentFilter?.id}
      />

      {/* Captured Thumbnails */}
      {capturedImages.length > 0 && (
        <div className="mt-4">
          <h3 style={{ color: palette.primary }}>Captured Photos:</h3>
          <div className="d-flex flex-column align-items-center gap-3 w-100">
            {capturedImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Screenshot ${index + 1}`}
                className="border rounded-3 img-fluid"
                style={{
                  maxWidth: "100%",
                  borderColor: palette.primary,
                  borderWidth: "2px",
                  height: "auto"
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
