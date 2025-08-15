import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";

const PolaroidStrip = () => {
  const stripRef = useRef(null);
  const location = useLocation();
  const [bgColor, setBgColor] = useState("#f8f8f8");
  const [caption, setCaption] = useState("Memories");
  const [currentTexture, setCurrentTexture] = useState("none");
  const [currentBorder, setCurrentBorder] = useState("none");
  const [isExporting, setIsExporting] = useState(false);
  
  const { state } = location;
  const images = state?.images || [];

  const colorOptions = [
    "#f8f8f8", "#fff0f0", "#f0fff0", "#f0f8ff", 
    "#f8f0ff", "#fffff0", "#f5f5f5", "#f0f0f0",
    "#ffecec", "#e8f5e9", "#e3f2fd", "#f3e5f5",
    "#fffde7", "#efebe9", "#eceff1"
  ];

  const textureOptions = [
    { id: "none", name: "None" },
    { id: "tape", name: "Tape" },
    { id: "film", name: "Film" },
    { id: "paper", name: "Paper" },
    { id: "grid", name: "Grid" }
  ];

  const borderOptions = [
    { id: "none", name: "None" },
    { id: "polaroid", name: "Classic" },
    { id: "filmstrip", name: "Film" },
    { id: "scrapbook", name: "Scrapbook" },
    { id: "vintage", name: "Vintage" }
  ];

  const downloadStrip = async () => {
    if (!stripRef.current || isExporting) return;
    setIsExporting(true);

    try {
      // Store original styles
      const originalTransform = stripRef.current.style.transform;
      const originalWidth = stripRef.current.style.width;
      const originalHeight = stripRef.current.style.height;
      
      // Remove scaling for capture
      stripRef.current.style.transform = 'none';
      stripRef.current.style.width = '540px';
      stripRef.current.style.height = '960px';

      // Preload all background images
      const imageElements = Array.from(stripRef.current.querySelectorAll('[style*="background-image"]'));
      await Promise.all(imageElements.map(el => {
        const src = el.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));

      // Add delay for CSS rendering
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(stripRef.current, {
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        scale: 2,
        logging: false,
        windowWidth: 540,
        windowHeight: 960,
        ignoreElements: (element) => {
          return element.classList.contains('ignore-export');
        }
      });

      // Restore original styles
      stripRef.current.style.transform = originalTransform;
      stripRef.current.style.width = originalWidth;
      stripRef.current.style.height = originalHeight;

      const link = document.createElement("a");
      link.download = "polaroid_memory.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const applyTexture = (texture) => {
    switch(texture) {
      case 'tape':
        return {
          backgroundImage: `
            linear-gradient(45deg, #f5f5f5 25%, transparent 25%), 
            linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #f5f5f5 75%), 
            linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          opacity: 0.15
        };
      case 'film':
        return {
          backgroundImage: `
            repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 5px),
            repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 5px)
          `,
          opacity: 0.1
        };
      case 'paper':
        return {
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")
          `,
          opacity: 0.2
        };
      case 'grid':
        return {
          backgroundImage: `
            linear-gradient(#dddddd 1px, transparent 1px), 
            linear-gradient(90deg, #dddddd 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          opacity: 0.1
        };
      default:
        return {};
    }
  };

  const applyBorder = (border) => {
    switch(border) {
      case 'polaroid':
        return {
          border: "15px solid white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(0,0,0,0.1)",
          padding: "10px 10px 50px 10px"
        };
      case 'filmstrip':
        return {
          border: "20px solid #222",
          padding: "5px",
          background: "#222",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
        };
      case 'scrapbook':
        return {
          border: "15px solid #f5e8d0",
          padding: "15px",
          background: "#f5e8d0",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%)"
        };
      case 'vintage':
        return {
          border: "10px double #8B4513",
          padding: "20px",
          background: "#FAF0E6",
          boxShadow: "0 5px 15px rgba(139, 69, 19, 0.2)"
        };
      default:
        return {};
    }
  };

  return (
    <div className="container text-center py-3">
      {/* Customization controls */}
      <div className="card mb-3 mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body p-3">
          {/* Color selection */}
          <div className="mb-3">
            <h6>Polaroid Color</h6>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {colorOptions.map((color) => (
                <div
                  key={color}
                  onClick={() => setBgColor(color)}
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: color,
                    borderRadius: "4px",
                    cursor: "pointer",
                    border: bgColor === color ? "3px solid #D9A299" : "1px solid #ddd",
                    boxShadow: bgColor === color ? "0 0 0 3px rgba(217, 162, 153, 0.3)" : "none"
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Texture selection */}
          <div className="mb-3">
            <h6>Background Texture</h6>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {textureOptions.map((texture) => (
                <button
                  key={texture.id}
                  onClick={() => setCurrentTexture(texture.id)}
                  className={`btn btn-sm ${currentTexture === texture.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  {texture.name}
                </button>
              ))}
            </div>
          </div>

          {/* Border selection */}
          <div className="mb-3">
            <h6>Border Style</h6>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {borderOptions.map((border) => (
                <button
                  key={border.id}
                  onClick={() => setCurrentBorder(border.id)}
                  className={`btn btn-sm ${currentBorder === border.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  {border.name}
                </button>
              ))}
            </div>
          </div>

          {/* Caption input */}
          <div className="mb-3">
            <label className="form-label">Caption</label>
            <input
              type="text"
              className="form-control"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add your memory caption"
            />
          </div>
        </div>
      </div>

      {/* Preview container */}
      <div 
        className="d-inline-block"
        style={{
          maxWidth: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          padding: "20px 0"
        }}
      >
        <div
          ref={stripRef}
          style={{
            width: "min(540px, 90vw)",
            height: "min(960px, 160vw)",
            aspectRatio: "9/16",
            backgroundColor: bgColor,
            padding: "40px 30px 60px 30px",
            boxSizing: "border-box",
            position: "relative",
            transform: "scale(0.8)",
            transformOrigin: "center top",
            ...applyBorder(currentBorder)
          }}
        >
          {/* Grain overlay */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"noise\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"1\" numOctaves=\"5\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23noise)\" opacity=\"0.2\"/></svg>')",
            pointerEvents: "none",
            mixBlendMode: "multiply",
            zIndex: 1
          }} />

          {/* Texture overlay */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            ...applyTexture(currentTexture),
            zIndex: 2
          }} />

          {/* Photo grid */}
          <div style={{
            display: "grid",
            gridTemplateRows: "1fr 1fr 1fr",
            gap: "15px",
            height: "100%",
            filter: "sepia(0.3) contrast(1.1) brightness(1.05)",
            position: "relative",
            zIndex: 3
          }}>
            {images.map((img, i) => {
              const imgSrc = img.startsWith('data:') ? img : `${img}?${new Date().getTime()}`;
              return (
                <div
                  key={i}
                  style={{
                    backgroundImage: `url(${imgSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "4px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
                    width: "100%",
                    height: "100%",
                    minHeight: "250px"
                  }}
                />
              );
            })}
          </div>

          {/* Polaroid footer */}
          <div style={{
            position: "absolute",
            bottom: "20px",
            left: "30px",
            right: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            zIndex: 4
          }}>
            <div style={{
              fontSize: "14px",
              color: "#666",
              fontFamily: "'Courier New', monospace",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)"
            }}>
              {getCurrentDate()}
            </div>
            <div style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
              fontFamily: "'Courier New', monospace",
              textAlign: "right",
              maxWidth: "60%",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)"
            }}>
              {caption}
            </div>
          </div>

          {/* Film perforations for filmstrip border */}
          {currentBorder === 'filmstrip' && (
            <>
              <div style={{
                position: "absolute",
                left: "5px",
                top: "50%",
                transform: "translateY(-50%)",
                height: "80%",
                width: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                zIndex: 4
              }}>
                {[...Array(12)].map((_, i) => (
                  <div key={`left-${i}`} style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#555",
                    margin: "5px 0"
                  }} />
                ))}
              </div>
              <div style={{
                position: "absolute",
                right: "5px",
                top: "50%",
                transform: "translateY(-50%)",
                height: "80%",
                width: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                zIndex: 4
              }}>
                {[...Array(12)].map((_, i) => (
                  <div key={`right-${i}`} style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#555",
                    margin: "5px 0"
                  }} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Download button */}
      <div style={{ padding: "20px 0" }}>
        <button
          onClick={downloadStrip}
          className="btn btn-success btn-lg mb-3"
          style={{ 
            backgroundColor: "#9c7c5b", 
            borderColor: "#9c7c5b",
            minWidth: "250px"
          }}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : '⬇️ Download Polaroid Memory'}
        </button>
      </div>
    </div>
  );
};

export default PolaroidStrip;