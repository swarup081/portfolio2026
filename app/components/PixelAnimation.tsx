'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
  speed: number;
}

export default function PixelAnimation({ src, className }: { src: string, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isInView || !canvasRef.current || isLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Retina DPI scaling for perfect sharpness
    const dpr = window.devicePixelRatio || 1;
    
    // Create a massive canvas bounds to prevent any clipping of particles
    const logicalWidth = window.innerWidth * 1.5;
    const logicalHeight = window.innerHeight * 1.5;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    
    // Force CSS size to match logical size
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      // Determine target image size based on screen width (matching Footer breakpoints)
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;
      const imgTargetWidth = isMobile ? 200 : isTablet ? 280 : 350;
      const imgTargetHeight = Math.floor((img.height / img.width) * imgTargetWidth);

      // Center the image within the massive canvas
      const offsetX = (logicalWidth - imgTargetWidth) / 2;
      const offsetY = (logicalHeight - imgTargetHeight) / 2;

      // Draw onto hidden canvas to extract pixel data
      const hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = imgTargetWidth;
      hiddenCanvas.height = imgTargetHeight;
      const hiddenCtx = hiddenCanvas.getContext('2d');
      if (!hiddenCtx) return;
      
      hiddenCtx.imageSmoothingEnabled = false;
      hiddenCtx.drawImage(img, 0, 0, imgTargetWidth, imgTargetHeight);
      
      const imageData = hiddenCtx.getImageData(0, 0, imgTargetWidth, imgTargetHeight);
      const data = imageData.data;

      const particles: Particle[] = [];
      const chunkSize = 2; // Reverted back to 2 for detailed assembly
      
      for (let y = 0; y < imgTargetHeight; y += chunkSize) {
        for (let x = 0; x < imgTargetWidth; x += chunkSize) {
          const index = (y * imgTargetWidth + x) * 4;
          const a = data[index + 3];

          if (a > 10) {
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            // Scatter completely across the massive canvas bounds
            particles.push({
              originX: x + offsetX,
              originY: y + offsetY,
              x: Math.random() * logicalWidth,
              y: Math.random() * logicalHeight,
              color: `rgba(${r},${g},${b},${a / 255})`,
              speed: Math.random() * 0.04 + 0.02
            });
          }
        }
      }

      setIsLoaded(true);

      let animationFrameId: number;
      
      const animate = () => {
        ctx.clearRect(0, 0, logicalWidth, logicalHeight);
        
        let settledCount = 0;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          
          const dx = p.originX - p.x;
          const dy = p.originY - p.y;
          
          // Lerp
          p.x += dx * p.speed;
          p.y += dy * p.speed;

          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
            p.x = p.originX;
            p.y = p.originY;
            settledCount++;
          }

          ctx.fillStyle = p.color;
          // Math.round forces strict pixel grid alignment preventing subpixel blur
          ctx.fillRect(Math.round(p.x), Math.round(p.y), chunkSize, chunkSize);
        }

        if (settledCount < particles.length) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          // PERFECT FINAL STATE: Draw the pristine original image scaled to target width
          ctx.clearRect(0, 0, logicalWidth, logicalHeight);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, offsetX, offsetY, imgTargetWidth, imgTargetHeight);
        }
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    };
  }, [isInView, src, isLoaded]);

  return (
    <div ref={containerRef} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] flex justify-center items-center pointer-events-none ${className || ''}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain drop-shadow-2xl"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
