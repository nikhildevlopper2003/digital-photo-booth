import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import spotifyPlayBar from "./images/spotifyplay.png";
import { useLocation } from "react-router-dom";

const SpotifyCard = () => {
  const stripRef = useRef(null);
  const location = useLocation();
  const [songTitle, setSongTitle] = useState("Your Vibe");
  const [artistName, setArtistName] = useState("Captured Moments");
  const [isEditing, setIsEditing] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const { state } = location;
  const images = state?.images || [];

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const downloadStrip = async () => {
    if (!stripRef.current || !fontsLoaded) return;

    const originalTransform = stripRef.current.style.transform;
    const originalWidth = stripRef.current.style.width;
    const originalHeight = stripRef.current.style.height;
    
    stripRef.current.style.transform = "none";
    stripRef.current.style.width = "540px";
    stripRef.current.style.height = "960px";

    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 300));
    
    await Promise.all(
      Array.from(stripRef.current.querySelectorAll("img")).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve();
            else img.onload = resolve;
          })
      )
    );

    const canvas = await html2canvas(stripRef.current, {
      backgroundColor: "#000",
      useCORS: true,
      allowTaint: true,
      scale: 2,
      logging: false,
      windowWidth: 540,
      windowHeight: 960,
      letterRendering: true
    });

    stripRef.current.style.transform = originalTransform;
    stripRef.current.style.width = originalWidth;
    stripRef.current.style.height = originalHeight;

    const link = document.createElement("a");
    link.download = "spotify_story_strip.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleSave = () => setIsEditing(false);

  const textStyles = {
    songTitle: {
      fontSize: "clamp(18px, 3vw, 24px)",
      fontWeight: 700,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100%",
      letterSpacing: "0.5px",
      fontFamily: "'Nunito', sans-serif",
      lineHeight: "1.2"
    },
    artistName: {
      fontSize: "clamp(16px, 2.5vw, 20px)",
      fontWeight: 500,
      color: "#666",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100%",
      letterSpacing: "0.5px",
      fontFamily: "'Nunito', sans-serif",
      lineHeight: "1.2"
    }
  };

  return (
    <div className="container text-center py-3">
      {isEditing ? (
        <div className="card mb-3 mx-auto" style={{ maxWidth: "400px", width: "100%" }}>
          <div className="card-body p-3">
            <div className="mb-2">
              <label className="form-label mb-1">Song Title:</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label mb-1">Artist Name:</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
              />
            </div>
            <button onClick={handleSave} className="btn btn-success btn-sm">
              Save
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="btn btn-success btn-sm mb-3"
        >
          Edit Song Info
        </button>
      )}

      {/* Responsive preview */}
      <div 
        className="d-inline-block w-100"
        style={{
          maxWidth: "540px",
          margin: "0 auto",
          padding: "20px 0"
        }}
      >
        <div
          ref={stripRef}
          style={{
            border: "8px solid black",
            width: "100%",
            aspectRatio: "9/16",
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "content-box",
            transform: "scale(0.8)",
            transformOrigin: "center top",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#fff",
              fontFamily: "'Nunito', sans-serif",
              padding: "20px 30px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Photo stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {images.map((img, i) => (
                <div
                  key={i}
                  style={{
                    height: "clamp(150px, 25vh, 225px)",
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "1px solid #ccc",
                  }}
                />
              ))}
            </div>

            {/* Bottom section */}
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: "10px",
                height: "200px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "150px",
                  left: "30px",
                  textAlign: "left",
                  width: "calc(100% - 60px)",
                }}
              >
                <div style={textStyles.songTitle}>{songTitle}</div>
                <div style={textStyles.artistName}>{artistName}</div>
              </div>

              <img
                src={spotifyPlayBar}
                alt="Spotify bar"
                style={{
                  width: "80%",
                  maxWidth: "420px",
                  height: "auto",
                  display: "block",
                  position: "absolute",
                  bottom: "10px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Download button */}
      <div style={{ padding: "20px 0" }}>
        <button
          onClick={downloadStrip}
          className="btn btn-success btn-lg w-100 w-md-auto"
          style={{
            backgroundColor: "#1DB954",
            borderColor: "#1DB954",
            padding: "10px 20px",
            fontSize: "16px",
          }}
          disabled={!fontsLoaded}
        >
          {fontsLoaded ? 'Download Spotify Strip' : 'Loading Fonts...'}
        </button>
      </div>
    </div>
  );
};

export default SpotifyCard;
