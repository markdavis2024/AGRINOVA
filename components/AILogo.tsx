import React from "react";

interface AILogoProps {
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export default function AILogo({ size = 40, showLabel = true, className = "" }: AILogoProps) {
  return (
    <div className={`ai-logo-wrapper ${className}`}>
      <div className="ai-logo-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glow effect */}
          <circle cx="50" cy="50" r="45" fill="url(#aiGlow)" opacity="0.3" />
          
          {/* Main circle */}
          <circle cx="50" cy="50" r="38" fill="#059669" stroke="#34d399" strokeWidth="2" />
          
          {/* Neural network lines */}
          <path d="M30 50 L70 50" stroke="white" strokeWidth="1.5" opacity="0.5" />
          <path d="M50 30 L50 70" stroke="white" strokeWidth="1.5" opacity="0.5" />
          <path d="M35 35 L65 65" stroke="white" strokeWidth="1.5" opacity="0.3" />
          <path d="M65 35 L35 65" stroke="white" strokeWidth="1.5" opacity="0.3" />
          
          {/* Nodes */}
          <circle cx="30" cy="50" r="5" fill="#34d399" />
          <circle cx="50" cy="30" r="5" fill="#34d399" />
          <circle cx="70" cy="50" r="5" fill="#34d399" />
          <circle cx="50" cy="70" r="5" fill="#34d399" />
          <circle cx="50" cy="50" r="6" fill="white" />
          
          {/* Leaf accent */}
          <path d="M48 44 L52 38 L56 44 L52 50 L48 44Z" fill="#34d399" opacity="0.9" />
          
          {/* AI text */}
          <text x="50" y="86" textAnchor="middle" fill="white" fontSize="13" fontWeight="800" fontFamily="Arial, sans-serif">
            AI
          </text>
          
          <defs>
            <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      {showLabel && (
        <div className="ai-logo-text">
          <span className="ai-logo-title">AGRINOVA</span>
          <span className="ai-logo-subtitle">AI Assistant</span>
        </div>
      )}
      
      <style jsx>{`
        .ai-logo-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .ai-logo-icon {
          flex-shrink: 0;
          animation: pulse 3s ease-in-out infinite;
        }
        
        .ai-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        
        .ai-logo-title {
          font-size: 20px;
          font-weight: 800;
          color: #059669;
          letter-spacing: -0.5px;
        }
        
        .ai-logo-subtitle {
          font-size: 10px;
          color: #6b7280;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}