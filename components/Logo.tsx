"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  width?: number;
  height?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ 
  width = 150, 
  height = 50, 
  showText = true,
  className = "" 
}: LogoProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!imgError ? (
        <Image
          src="/AGRINOVA-logo.png"
          alt="AGRINOVA Logo"
          width={width}
          height={height}
          className="object-contain"
          priority
          onError={() => setImgError(true)}
        />
      ) : (
        // Fallback - show a simple text logo if image fails
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <span className="text-xl font-bold text-[#2d5a27]">AGRINOVA</span>
        </div>
      )}
    </div>
  );
}