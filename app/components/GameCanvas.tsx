'use client';

import React, { useEffect, useRef } from 'react';

const BOARD_SIZE = 10; // 10x10
const CELL_SIZE = 60; // pixels

const snakes = [
    { from: 96, to: 78 },
    { from: 93, to: 64 },
    { from: 72, to: 53 },
    { from: 66, to: 59 },
    { from: 32, to: 12 },
    { from: 27, to: 8 },
];

const ladders = [
    { from: 3, to: 22 },
    { from: 11, to: 49 },
    { from: 15, to: 38 },
    { from: 40, to: 68 },
];

const getCoordinates = (cell: number) => {
    const row = Math.floor((cell - 1) / BOARD_SIZE);
    let col = (cell - 1) % BOARD_SIZE;
    if (row % 2 === 1) {
        col = BOARD_SIZE - 1 - col; // reverse for zigzag
    }
    return {
        x: col * CELL_SIZE + CELL_SIZE / 2,
        y: (BOARD_SIZE - 1 - row) * CELL_SIZE + CELL_SIZE / 2,
    };
};

export default function SnakesAndLaddersCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Load PIXI.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.4.2/pixi.min.js';
        script.onload = () => {
            const PIXI = (window as any).PIXI;

            const app = new PIXI.Application({
                width: CELL_SIZE * BOARD_SIZE,
                height: CELL_SIZE * BOARD_SIZE,
                backgroundColor: 0x1e293b, // Tailwind slate-900
                antialias: true,
                view: canvasRef.current,
            });

            const graphics = new PIXI.Graphics();

            // Draw Grid
            graphics.lineStyle(1, 0xffffff, 0.5);
            for (let i = 0; i <= BOARD_SIZE; i++) {
                // horizontal lines
                graphics.moveTo(0, i * CELL_SIZE);
                graphics.lineTo(CELL_SIZE * BOARD_SIZE, i * CELL_SIZE);

                // vertical lines
                graphics.moveTo(i * CELL_SIZE, 0);
                graphics.lineTo(i * CELL_SIZE, CELL_SIZE * BOARD_SIZE);
            }

            // Draw Numbers
            const style = new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 12,
                fill: '#ffffff',
            });

            for (let i = 1; i <= 100; i++) {
                const { x, y } = getCoordinates(i);
                const text = new PIXI.Text(i.toString(), style);
                text.anchor.set(0.5);
                text.x = x;
                text.y = y;
                app.stage.addChild(text);
            }

            // Draw Ladders
            ladders.forEach(({ from, to }) => {
                const fromCoord = getCoordinates(from);
                const toCoord = getCoordinates(to);

                graphics.lineStyle(6, 0x8b4513); // brown
                graphics.moveTo(fromCoord.x, fromCoord.y);
                graphics.lineTo(toCoord.x, toCoord.y);
            });

            // Draw Snakes
            snakes.forEach(({ from, to }) => {
                const fromCoord = getCoordinates(from);
                const toCoord = getCoordinates(to);

                graphics.lineStyle(6, 0x4ade80); // green
                graphics.moveTo(fromCoord.x, fromCoord.y);
                graphics.bezierCurveTo(
                    fromCoord.x + 20,
                    fromCoord.y - 40,
                    toCoord.x - 20,
                    toCoord.y + 40,
                    toCoord.x,
                    toCoord.y
                );
            });

            app.stage.addChild(graphics);
        };

        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return <canvas ref={canvasRef} className="border border-gray-300"></canvas>;
}