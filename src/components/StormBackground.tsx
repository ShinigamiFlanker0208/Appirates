'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const StormBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Hook to listen for page changes
  const pathname = usePathname();

  // 2. Ref to hold the ship's current X position
  // We start it at -1000 so it's fully off-screen to the left on first load
  const shipXRef = useRef(-1000);

  // 3. Reset ship position when the route changes
  useEffect(() => {
    // Whenever the page changes, throw the ship back to the left side
    shipXRef.current = -500;
  }, [pathname]);

  useEffect(() => {
    const logoImg = new Image();
    logoImg.src = '/logo.PNG';

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // --- CONFIGURATION ---
    const rainCount = 1800;
    const rainAngle = 0.35;
    const rainSpeedBase = 5;
    const seaHeight = 220;

    // --- RAIN LOGIC ---
    interface Raindrop {
      x: number; y: number; length: number; speed: number; opacity: number;
    }
    const raindrops: Raindrop[] = [];

    const createRain = () => {
      raindrops.length = 0;
      for (let i = 0; i < rainCount; i++) {
        raindrops.push({
          x: Math.random() * (width + 600) - 600,
          y: Math.random() * height,
          length: Math.random() * 20 + 10,
          speed: Math.random() * rainSpeedBase + 4,
          opacity: Math.random() * 0.35 + 0.15,
        });
      }
    };

    const drawRain = () => {
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.45)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < raindrops.length; i++) {
        const drop = raindrops[i];
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + rainAngle * drop.length, drop.y + drop.length);
        ctx.globalAlpha = drop.opacity;
        ctx.stroke();
        drop.x -= rainAngle * 1.5;
        drop.y += drop.speed;
        if (drop.y > height) {
          drop.y = -50;
          drop.x = Math.random() * (width + 600) - 600;
        }
      }
      ctx.globalAlpha = 1;
    };

    // --- SHIP DRAWING LOGIC ---
    const drawShip = (time: number) => {
      // --- THE MOVEMENT PHYSICS (SLOW & DRAMATIC) ---
      const targetShipX = width * 0.75; // The docking spot on the right

      // Calculate distance to target
      const distance = targetShipX - shipXRef.current;

      if (distance > 1) {
        // Sail towards target. Slow easing (0.008) and slow base speed (0.8)
        shipXRef.current += (distance * 0.004) + 0.05;
      } else {
        // Snap to target exactly once it's close enough
        shipXRef.current = targetShipX;
      }

      const shipX = shipXRef.current; // Grab the current animated value

      const waveFreq = 0.0025;
      const waveAmp = 35;
      const waveSpeed = time * 0.0005;

      // Calculate Y based on the animated X position (makes it ride the waves)
      const shipY = (height - seaHeight * 0.5 + 35) +
          Math.sin(shipX * waveFreq + waveSpeed) * waveAmp;

      const nextY = (height - seaHeight * 0.5 + 35) +
          Math.sin((shipX + 1) * waveFreq + waveSpeed) * waveAmp;
      const angle = Math.atan2(nextY - shipY, 1);

      ctx.save();
      ctx.translate(shipX, shipY);
      ctx.rotate(angle * 1.5);

      const scale = 6.5;
      ctx.scale(scale, scale);

      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255,0,0,0.5)';
      ctx.fillStyle = '#050810';
      ctx.strokeStyle = '#df0e0e';
      ctx.lineWidth = 0.8 / scale;

      // 1. Hull
      ctx.beginPath();
      ctx.moveTo(-50, 0);
      ctx.lineTo(-55, -10);
      ctx.lineTo(55, -10);
      ctx.lineTo(50, 0);
      ctx.bezierCurveTo(45, 15, -45, 15, -50, 0);
      ctx.fill();
      ctx.stroke();

      // 2. Masts
      ctx.beginPath();
      ctx.moveTo(0, -10); ctx.lineTo(0, -70);      // Main
      ctx.moveTo(-30, -10); ctx.lineTo(-30, -55);  // Fore
      ctx.moveTo(25, -10); ctx.lineTo(25, -50);    // Mizzen
      ctx.stroke();

      // --- 3. INVERTED SAILS ---
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';

      const windPush = 4;
      const sailFlap = Math.sin(time * 0.004) * 2;
      const flow = windPush + sailFlap;

      const drawPointedSail = (mastX: number, mastTopY: number, width: number, height: number) => {
        const bottomY = mastTopY + height;

        ctx.beginPath();
        ctx.moveTo(mastX, mastTopY);
        ctx.quadraticCurveTo(
            mastX + width/2 + flow,
            mastTopY + height/2,
            mastX + width/2,
            bottomY
        );
        ctx.quadraticCurveTo(
            mastX,
            bottomY - 2,
            mastX - width/2,
            bottomY
        );
        ctx.quadraticCurveTo(
            mastX - width/2 + flow,
            mastTopY + height/2,
            mastX,
            mastTopY
        );
        ctx.fill();
        ctx.stroke();
      };

      drawPointedSail(0, -68, 40, 50);
      drawPointedSail(-30, -53, 25, 35);
      drawPointedSail(25, -48, 25, 30);

      ctx.restore();
    };

    const drawSea = (time: number) => {
      const gradient = ctx.createLinearGradient(0, height - seaHeight, 0, height);
      gradient.addColorStop(0, 'rgba(220, 38, 38, 0.0)');
      gradient.addColorStop(0.4, 'rgba(127, 29, 29, 0.15)');
      gradient.addColorStop(1, '#050505');
      ctx.fillStyle = gradient;

      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const layerHeight = height - (seaHeight * 0.5) + (i * 35);
        const frequency = 0.0025 + (i * 0.0015);
        const amplitude = 35 + (i * 12);
        const speed = time * 0.0005;
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 20) {
          const y = layerHeight + Math.sin(x * frequency + speed) * amplitude;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height); ctx.lineTo(0, height);
        ctx.fill();
        ctx.strokeStyle = `rgba(220, 38, 38, ${0.25 - (i * 0.05)})`;
        ctx.stroke();

        if (i === 1) drawShip(time);
      }
    };

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#1a0b0b');
      bgGradient.addColorStop(1, '#050505');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      drawRain();
      drawSea(time);
      time += 8;
      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width; canvas.height = height;
      createRain();
    };

    handleResize(); render();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
  );
};

export default StormBackground;