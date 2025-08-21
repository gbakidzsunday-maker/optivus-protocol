
import React, { useRef, useEffect } from 'react';

export const AnimatedWaveBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let frame = 0;

        const resizeCanvas = () => {
            // Check for offsetWidth/Height to avoid errors during component unmount
            if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
              canvas.width = canvas.offsetWidth;
              canvas.height = canvas.offsetHeight;
            }
        };

        const drawWave = (config: {
            y: number;
            amplitude: number;
            wavelength: number;
            color: string;
            lineWidth: number;
            speed: number;
        }) => {
            if (!ctx) return;
            const { y, amplitude, wavelength, color, lineWidth, speed } = config;
            const frequency = (2 * Math.PI) / wavelength;
            
            ctx.beginPath();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;

            for (let x = 0; x <= canvas.width; x++) {
                const waveY = y + amplitude * Math.sin(x * frequency + frame * speed);
                if (x === 0) {
                    ctx.moveTo(x, waveY);
                } else {
                    ctx.lineTo(x, waveY);
                }
            }
            ctx.stroke();
        };
        
        const animate = () => {
            frame++;
            if (!ctx || canvas.width === 0 || canvas.height === 0) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            };
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const numLines = 60;
            const baseAmplitude = canvas.height * 0.1;
            const baseWavelength = canvas.width * 0.8;

            for(let i = 0; i < numLines; i++) {
                const ratio = i / numLines;
                drawWave({
                    y: canvas.height * 0.35 + i * 9,
                    amplitude: baseAmplitude * (0.6 + Math.sin(i * 0.1) * 0.4),
                    wavelength: baseWavelength * (0.9 + Math.cos(i * 0.05) * 0.1),
                    color: `rgba(167, 85, 247, ${0.05 + ratio * 0.4})`,
                    lineWidth: 1.5,
                    speed: 0.015 + Math.sin(i * 0.1) * 0.005
                });
            }

            animationFrameId = requestAnimationFrame(animate);
        };
        
        resizeCanvas();
        animate();
        
        const resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(canvas);
        
        const resetInterval = setInterval(() => {
            frame = 0;
        }, 5000);

        return () => {
            if (canvas) {
                resizeObserver.unobserve(canvas);
            }
            cancelAnimationFrame(animationFrameId);
            clearInterval(resetInterval);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full z-0"
        />
    );
};
