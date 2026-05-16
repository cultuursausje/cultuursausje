/**
 * Decoratieve achtergrond met twee SVG-discobollen + een laag iridescente specks
 * die met de pagina meescrolt. De bollen zelf staan vast (fixed), waardoor het
 * voelt alsof zij vanuit hun positie licht projecteren op de pagina-onderdelen
 * die langskomen als je scrollt.
 */
export function DiscoBackground() {
  return (
    <>
      {/* Specks-laag: position: absolute binnen body — scrollt mee met content */}
      <div className="scroll-projection" aria-hidden="true" />

      {/* Sunset wash & ambient glow op vaste hoeken */}
      <div className="disco-projection" aria-hidden="true" />

      {/* Grote discobol — rechtsboven, half buiten beeld */}
      <svg
        className="disco-ball-svg disco-ball-big"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="db1-shade" cx="32%" cy="28%" r="90%">
            <stop offset="0%" stopColor="#FFF8E0" />
            <stop offset="28%" stopColor="#ECC988" />
            <stop offset="70%" stopColor="#9F6A36" />
            <stop offset="100%" stopColor="#3D2510" />
          </radialGradient>
          <pattern id="db1-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="0.55" />
          </pattern>
          <pattern id="db1-colors" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="1" y="1" width="8" height="8" fill="rgba(255,240,200,0.5)" />
            <rect x="11" y="1" width="8" height="8" fill="rgba(220,210,250,0.42)" />
            <rect x="1" y="11" width="8" height="8" fill="rgba(255,220,210,0.45)" />
            <rect x="11" y="11" width="8" height="8" fill="rgba(255,210,180,0.5)" />
          </pattern>
          <radialGradient id="db1-edge" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.5" />
          </radialGradient>
          <radialGradient id="db1-highlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="55%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Bolvorm-shading */}
        <circle cx="100" cy="100" r="100" fill="url(#db1-shade)" />
        {/* Subtiele tegelkleurvariatie */}
        <circle cx="100" cy="100" r="100" fill="url(#db1-colors)" />
        {/* Voegen tussen de spiegeltjes */}
        <circle cx="100" cy="100" r="100" fill="url(#db1-grid)" />
        {/* Donkere rand voor sferische 3D-suggestie */}
        <circle cx="100" cy="100" r="100" fill="url(#db1-edge)" />

        {/* Heldere highlight in linkerboven kwart */}
        <ellipse cx="65" cy="55" rx="32" ry="22" fill="url(#db1-highlight)" />

        {/* Een handvol fonkelende spiegeltjes (random verspreid) */}
        <g className="disco-sparkles">
          <rect x="30" y="40" width="9" height="9" fill="rgba(255,255,255,0.85)" />
          <rect x="80" y="30" width="9" height="9" fill="rgba(255,255,250,0.72)" />
          <rect x="140" y="80" width="9" height="9" fill="rgba(255,240,210,0.7)" />
          <rect x="100" y="120" width="9" height="9" fill="rgba(255,220,230,0.6)" />
          <rect x="50" y="130" width="9" height="9" fill="rgba(220,230,255,0.6)" />
          <rect x="160" y="60" width="9" height="9" fill="rgba(255,250,220,0.65)" />
          <rect x="60" y="80" width="9" height="9" fill="rgba(255,255,255,0.6)" />
          <rect x="120" y="50" width="9" height="9" fill="rgba(255,230,200,0.65)" />
          <rect x="40" y="100" width="9" height="9" fill="rgba(255,255,250,0.55)" />
          <rect x="110" y="160" width="9" height="9" fill="rgba(240,230,255,0.55)" />
          <rect x="150" y="130" width="9" height="9" fill="rgba(255,225,200,0.6)" />
          <rect x="20" y="70" width="9" height="9" fill="rgba(255,235,225,0.55)" />
        </g>
      </svg>

      {/* Kleinere discobol — linksonder, half buiten beeld, koelere tinten */}
      <svg
        className="disco-ball-svg disco-ball-small"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="db2-shade" cx="32%" cy="28%" r="90%">
            <stop offset="0%" stopColor="#FFE6F2" />
            <stop offset="28%" stopColor="#E5B5CE" />
            <stop offset="70%" stopColor="#9866A0" />
            <stop offset="100%" stopColor="#391D43" />
          </radialGradient>
          <pattern id="db2-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="none" stroke="rgba(0,0,0,0.26)" strokeWidth="0.5" />
          </pattern>
          <pattern id="db2-colors" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="1" y="1" width="8" height="8" fill="rgba(255,225,235,0.45)" />
            <rect x="11" y="1" width="8" height="8" fill="rgba(220,210,250,0.42)" />
            <rect x="1" y="11" width="8" height="8" fill="rgba(255,230,210,0.45)" />
            <rect x="11" y="11" width="8" height="8" fill="rgba(240,210,240,0.45)" />
          </pattern>
          <radialGradient id="db2-edge" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.45" />
          </radialGradient>
          <radialGradient id="db2-highlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="55%" stopColor="white" stopOpacity="0.28" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="100" fill="url(#db2-shade)" />
        <circle cx="100" cy="100" r="100" fill="url(#db2-colors)" />
        <circle cx="100" cy="100" r="100" fill="url(#db2-grid)" />
        <circle cx="100" cy="100" r="100" fill="url(#db2-edge)" />
        <ellipse cx="65" cy="55" rx="32" ry="22" fill="url(#db2-highlight)" />

        <g className="disco-sparkles">
          <rect x="35" y="45" width="9" height="9" fill="rgba(255,255,255,0.8)" />
          <rect x="85" y="35" width="9" height="9" fill="rgba(255,235,245,0.7)" />
          <rect x="140" y="85" width="9" height="9" fill="rgba(240,225,255,0.65)" />
          <rect x="105" y="125" width="9" height="9" fill="rgba(255,225,230,0.6)" />
          <rect x="55" y="125" width="9" height="9" fill="rgba(225,230,255,0.6)" />
          <rect x="155" y="55" width="9" height="9" fill="rgba(255,250,235,0.65)" />
          <rect x="65" y="85" width="9" height="9" fill="rgba(255,255,255,0.6)" />
          <rect x="125" y="50" width="9" height="9" fill="rgba(255,230,225,0.6)" />
          <rect x="45" y="100" width="9" height="9" fill="rgba(255,250,250,0.55)" />
          <rect x="115" y="155" width="9" height="9" fill="rgba(240,225,255,0.55)" />
        </g>
      </svg>
    </>
  );
}
