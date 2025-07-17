import { useEffect, useRef } from "react";
import { color } from "./color";

const Background = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<any[]>([]);
    const STAR_COUNT = 250;

    const getStarSize = () => {
        const screenWidth = window.innerWidth;
        return {
            min: screenWidth < 768 ? 0.5 : 1,
            max: screenWidth < 768 ? 2 : 4,
        };
    };

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        let animationFrameId: number;

        const generateStars = () => {
            const { min, max } = getStarSize();
            starsRef.current = Array.from({ length: STAR_COUNT }).map(() => {
                const r = Math.random() * (max - min) + min;
                const speed = Math.random() * 0.1 + 0.1;
                const isAngled = Math.random() < 0.1;
                const angleDeg = isAngled
                    ? 90 + (Math.random() * 10 - 5) 
                    : 90;
                const angle = (angleDeg * Math.PI) / 180;

                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r,
                    vx: Math.cos(angle) * speed, 
                    vy: Math.sin(angle) * speed, 
                };

            });
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            generateStars();
        };

        resizeCanvas();

        const draw = () => {
            ctx.fillStyle = color.neutral5;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#2F2F2F";
            const { min, max } = getStarSize();

            starsRef.current.forEach((star) => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                ctx.fill();

                star.x += star.vx;
                star.y += star.vy;

                if (
                    star.y > canvas.height + star.r ||
                    star.x < -star.r ||
                    star.x > canvas.width + star.r
                ) {
                    star.x = Math.random() * canvas.width;
                    star.y = -star.r;
                    star.r = Math.random() * (max - min) + min;

                    const speed = Math.random() * 0.2 + 0.2;
                    const isAngled = Math.random() < 0.1;
                    const angleDeg = isAngled
                        ? 90 + (Math.random() * 10 - 5)
                        : 90;
                    const angle = (angleDeg * Math.PI) / 180;

                    star.vx = Math.cos(angle) * speed;
                    star.vy = Math.sin(angle) * speed;

                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        window.addEventListener("resize", resizeCanvas);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: -1,
                width: "100%",
                height: "100%",
                background: color.neutral5,
            }}
        />
    );
};

export default Background;
