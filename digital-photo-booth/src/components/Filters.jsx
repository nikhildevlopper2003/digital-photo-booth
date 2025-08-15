import React from 'react';

const Filters = ({ onFilterSelect, currentFilter }) => {
  const filters = [
    { id: 'dreamy-blue', name: '🧊 Dreamy Blue', css: 'saturate(0.9) hue-rotate(15deg) contrast(1.1) brightness(1.05) blur(1px)', overlay: 'rgba(173, 216, 230, 0.15)' },
    { id: 'warm-vintage', name: '🌞 Warm Vintage', css: 'sepia(0.3) contrast(0.9) brightness(1.05) saturate(0.8)', overlay: 'rgba(255, 220, 150, 0.08)' },
    { id: 'soft-pink', name: '💗 Soft Pink', css: 'hue-rotate(20deg) saturate(1.2) brightness(1.1)', overlay: 'rgba(255, 182, 193, 0.1)' },
    { id: 'kodak-grain', name: '🎞️ Kodak Grain', css: 'contrast(1.1) saturate(1.05)', overlay: 'url(#grain)' },
    { id: 'disco-glow', name: '✨ Disco Glow', css: 'saturate(1.4) contrast(1.2)', overlay: 'linear-gradient(45deg, rgba(255,0,255,0.15), rgba(0,255,255,0.15))' },
    { id: 'autumn-dust', name: '🍂 Autumn Dust', css: 'saturate(0.85) contrast(1.1) sepia(0.1)', overlay: 'rgba(139, 69, 19, 0.1)' },
    { id: 'cloudy-day', name: '☁️ Cloudy Day', css: 'saturate(0.5) brightness(1.05) contrast(0.9) blur(1px)', overlay: 'rgba(176, 196, 222, 0.05)' },
    { id: 'bw-contrast', name: '🖤 B&W Contrast', css: 'grayscale(1) contrast(1.4) brightness(1.1)', overlay: 'none' },
    { id: 'fairycore', name: '🌸 Fairycore', css: 'brightness(1.1) blur(1px) saturate(1.15)', overlay: 'linear-gradient(45deg, rgba(255,192,203,0.1), rgba(173,216,230,0.1))' },
    { id: 'vhs-glitch', name: '📼 VHS Glitch', css: 'saturate(1.05) contrast(1.1)', overlay: 'none' }
  ];

  return (
    <div className="mt-4">
      <h4 className="text-center mb-3">Filters</h4>
      <div className="d-flex flex-wrap justify-content-center gap-2 w-100">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterSelect(filter)}
            className={`btn btn-sm ${currentFilter === filter.id ? 'btn-primary' : 'btn-outline-secondary'}`}
            style={{
              flex: '1 1 auto',
              minWidth: '120px', // larger tap target for mobile
              maxWidth: '180px',
              whiteSpace: 'nowrap'
            }}
          >
            {filter.name}
          </button>
        ))}
      </div>
      
      {/* SVG grain filter definition */}
      <svg style={{ display: 'none' }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.08" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </svg>
    </div>
  );
};

export default Filters;
