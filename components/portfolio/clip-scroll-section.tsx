"use client";

import { useEffect, useRef, useState } from "react";

import clipImage from "@/TextClipScroll/img/3.png";
import { TextScrollBackground } from "./text-scroll-background";

// Static virtual canvas size for uniform physics calculations across devices
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 420;
const DEFAULT_PADDLE_WIDTH = 160;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;
const POWERUP_SIZE = 24;

type Ball = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

type Brick = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points: number;
  active: boolean;
};

type PowerUp = {
  x: number;
  y: number;
  dy: number;
  type: "paddle" | "ball" | "life";
  active: boolean;
};

export const ClipScrollSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  // Game state
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover" | "victory">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);

  // Refs for loop physics to bypass React rendering cycles
  const paddleX = useRef(CANVAS_WIDTH / 2 - DEFAULT_PADDLE_WIDTH / 2);
  const paddleWidth = useRef(DEFAULT_PADDLE_WIDTH);
  const balls = useRef<Ball[]>([]);
  const bricks = useRef<Brick[]>([]);
  const powerUps = useRef<PowerUp[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  
  // Controls tracking
  const keysPressed = useRef<{ ArrowLeft: boolean; ArrowRight: boolean }>({
    ArrowLeft: false,
    ArrowRight: false,
  });

  // Sound Synthesizer using Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playBeep = (freq: number, type: OscillatorType, duration: number) => {
    if (typeof window === "undefined") return;
    try {
      let ctx = audioCtxRef.current;
      if (!ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        ctx = new AudioContextClass();
        audioCtxRef.current = ctx;
      }
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Volume envelope to avoid clicks
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore context creation blocks
    }
  };

  // High score initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portfolio_breakout_highscore");
      if (stored) setHighScore(parseInt(stored, 10));
    }
  }, []);

  // Section scroll tracker for the main clip path parallax
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const next = 1 - (rect.bottom / total);
      setProgress(Math.min(1, Math.max(0, next)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Initialize Game Items
  const initGame = () => {
    scoreRef.current = 0;
    livesRef.current = 3;
    setScore(0);
    setLives(3);
    paddleWidth.current = DEFAULT_PADDLE_WIDTH;
    paddleX.current = CANVAS_WIDTH / 2 - DEFAULT_PADDLE_WIDTH / 2;
    
    // Spawn initial ball
    balls.current = [{
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 60,
      dx: 5 * (Math.random() > 0.5 ? 1 : -1),
      dy: -5,
    }];

    // Generate bricks grid
    const rows = 4;
    const cols = 10;
    const brickW = 100;
    const brickH = 22;
    const gap = 10;
    const leftPad = (CANVAS_WIDTH - (cols * brickW + (cols - 1) * gap)) / 2;
    const topPad = 80;
    
    // Palette: Saffron/Orange, Sunset Red, Golden Yellow, Saffron/Orange
    const rowColors = ["#f1875d", "#e11d48", "#eab308", "#f1875d"];
    const rowPoints = [40, 30, 20, 10];

    const tempBricks: Brick[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        tempBricks.push({
          x: leftPad + c * (brickW + gap),
          y: topPad + r * (brickH + gap),
          width: brickW,
          height: brickH,
          color: rowColors[r],
          points: rowPoints[r],
          active: true,
        });
      }
    }
    bricks.current = tempBricks;
    powerUps.current = [];
  };

  const handleStartGame = () => {
    initGame();
    setGameState("playing");
    playBeep(400, "square", 0.1);
    setTimeout(() => playBeep(600, "square", 0.15), 100);
  };

  const handleExitGame = () => {
    setGameState("idle");
  };

  // Main Loop
  useEffect(() => {
    if (gameState !== "playing") return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      // 1. Paddle keyboard motion updates
      if (keysPressed.current.ArrowLeft) {
        paddleX.current = Math.max(0, paddleX.current - 9);
      }
      if (keysPressed.current.ArrowRight) {
        paddleX.current = Math.min(CANVAS_WIDTH - paddleWidth.current, paddleX.current + 9);
      }

      // 2. Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "#020204";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 3. Move Power-Ups
      powerUps.current.forEach((pu) => {
        if (!pu.active) return;
        pu.y += pu.dy;

        // Collision with paddle
        if (
          pu.y + POWERUP_SIZE >= CANVAS_HEIGHT - 30 &&
          pu.y <= CANVAS_HEIGHT - 10 &&
          pu.x + POWERUP_SIZE >= paddleX.current &&
          pu.x <= paddleX.current + paddleWidth.current
        ) {
          pu.active = false;
          playBeep(700, "triangle", 0.15);
          
          if (pu.type === "life") {
            livesRef.current = Math.min(5, livesRef.current + 1);
            setLives(livesRef.current);
          } else if (pu.type === "paddle") {
            // Expand paddle size
            paddleWidth.current = Math.min(300, paddleWidth.current + 60);
          } else if (pu.type === "ball") {
            // Add extra ball
            balls.current.push({
              x: CANVAS_WIDTH / 2,
              y: CANVAS_HEIGHT - 60,
              dx: (Math.random() * 4 + 3) * (Math.random() > 0.5 ? 1 : -1),
              dy: -5,
            });
          }
        }

        // Out of bounds
        if (pu.y > CANVAS_HEIGHT) {
          pu.active = false;
        }
      });

      // 4. Move Balls & Collisions
      balls.current.forEach((ball, bIndex) => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Wall collisions
        if (ball.x - BALL_RADIUS <= 0) {
          ball.x = BALL_RADIUS;
          ball.dx = -ball.dx;
          playBeep(220, "sine", 0.08);
        } else if (ball.x + BALL_RADIUS >= CANVAS_WIDTH) {
          ball.x = CANVAS_WIDTH - BALL_RADIUS;
          ball.dx = -ball.dx;
          playBeep(220, "sine", 0.08);
        }

        if (ball.y - BALL_RADIUS <= 0) {
          ball.y = BALL_RADIUS;
          ball.dy = -ball.dy;
          playBeep(220, "sine", 0.08);
        }

        // Paddle collision
        if (
          ball.y + BALL_RADIUS >= CANVAS_HEIGHT - 30 &&
          ball.y - BALL_RADIUS <= CANVAS_HEIGHT - 10 &&
          ball.x >= paddleX.current &&
          ball.x <= paddleX.current + paddleWidth.current
        ) {
          // Calculate relative hit position to determine return angle
          const relativeHit = (ball.x - (paddleX.current + paddleWidth.current / 2)) / (paddleWidth.current / 2);
          const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
          ball.dx = relativeHit * 6;
          ball.dy = -Math.sqrt(Math.max(9, speed * speed - ball.dx * ball.dx));
          ball.y = CANVAS_HEIGHT - 30 - BALL_RADIUS; // Snap on top
          playBeep(280, "triangle", 0.1);
        }

        // Bricks collision
        bricks.current.forEach((brick) => {
          if (!brick.active) return;

          const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width));
          const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height));
          const distX = ball.x - closestX;
          const distY = ball.y - closestY;
          const distSqr = distX * distX + distY * distY;

          if (distSqr < BALL_RADIUS * BALL_RADIUS) {
            brick.active = false;
            
            // Adjust score
            scoreRef.current += brick.points;
            setScore(scoreRef.current);
            playBeep(480, "square", 0.06);

            // Determine collision face
            const fromLeft = ball.x < brick.x;
            const fromRight = ball.x > brick.x + brick.width;
            const fromTop = ball.y < brick.y;
            const fromBottom = ball.y > brick.y + brick.height;

            if (fromLeft || fromRight) {
              ball.dx = -ball.dx;
            } else if (fromTop || fromBottom) {
              ball.dy = -ball.dy;
            } else {
              ball.dy = -ball.dy;
            }

            // Power-up spawn probability (15%)
            if (Math.random() < 0.15) {
              const types: ("paddle" | "ball" | "life")[] = ["paddle", "ball", "life"];
              const randomType = types[Math.floor(Math.random() * types.length)];
              powerUps.current.push({
                x: brick.x + brick.width / 2 - POWERUP_SIZE / 2,
                y: brick.y + brick.height,
                dy: 2.5,
                type: randomType,
                active: true,
              });
            }
          }
        });
      });

      // 5. Remove out-of-bound balls
      balls.current = balls.current.filter((ball) => ball.y - BALL_RADIUS <= CANVAS_HEIGHT);

      // 6. Handle Life Loss
      if (balls.current.length === 0) {
        livesRef.current -= 1;
        setLives(livesRef.current);

        if (livesRef.current <= 0) {
          // Game Over state
          setGameState("gameover");
          playBeep(250, "sawtooth", 0.2);
          setTimeout(() => playBeep(180, "sawtooth", 0.2), 150);
          setTimeout(() => playBeep(120, "sawtooth", 0.4), 300);

          // Update High Score
          if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem("portfolio_breakout_highscore", scoreRef.current.toString());
          }
          return;
        } else {
          // Respawn single ball
          playBeep(180, "sine", 0.3);
          balls.current = [{
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - 60,
            dx: 5 * (Math.random() > 0.5 ? 1 : -1),
            dy: -5,
          }];
          paddleX.current = CANVAS_WIDTH / 2 - paddleWidth.current / 2;
        }
      }

      // 7. Handle Victory check
      const remainingBricks = bricks.current.some((b) => b.active);
      if (!remainingBricks) {
        setGameState("victory");
        playBeep(520, "square", 0.1);
        setTimeout(() => playBeep(660, "square", 0.1), 120);
        setTimeout(() => playBeep(780, "square", 0.15), 240);
        setTimeout(() => playBeep(1040, "square", 0.35), 360);

        if (scoreRef.current > highScore) {
          setHighScore(scoreRef.current);
          localStorage.setItem("portfolio_breakout_highscore", scoreRef.current.toString());
        }
        return;
      }

      // 8. Render Canvas Elements
      // Draw Bricks
      bricks.current.forEach((brick) => {
        if (!brick.active) return;
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        
        // Brick shine details
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(brick.x, brick.y, brick.width, 4);
      });

      // Draw Paddle
      ctx.fillStyle = "#f1875d";
      ctx.beginPath();
      ctx.roundRect(paddleX.current, CANVAS_HEIGHT - 30, paddleWidth.current, PADDLE_HEIGHT, 8);
      ctx.fill();

      // Draw Balls
      ctx.fillStyle = "#ffffff";
      balls.current.forEach((ball) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing core
        ctx.fillStyle = "#f1875d";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff"; // restore fill
      });

      // Draw Power-ups
      powerUps.current.forEach((pu) => {
        if (!pu.active) return;
        ctx.save();
        
        // Define color and character representing the powerup
        let symbol = "";
        if (pu.type === "life") {
          ctx.fillStyle = "#e11d48"; // Sunset Red for life
          symbol = "♥";
        } else if (pu.type === "paddle") {
          ctx.fillStyle = "#2563eb"; // Royal Blue for paddle grow
          symbol = "↔";
        } else if (pu.type === "ball") {
          ctx.fillStyle = "#eab308"; // Golden Yellow for extra ball
          symbol = "●";
        }

        // Capsule shape
        ctx.beginPath();
        ctx.roundRect(pu.x, pu.y, POWERUP_SIZE, POWERUP_SIZE, 6);
        ctx.fill();

        // Symbol text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 15px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(symbol, pu.x + POWERUP_SIZE / 2, pu.y + POWERUP_SIZE / 2);
        ctx.restore();
      });

      // Draw Scores & Layout HUD
      ctx.font = "bold 18px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${scoreRef.current}`, 40, 40);
      ctx.fillText(`HIGH SCORE: ${highScore}`, 200, 40);
      
      // Draw Lives indicators
      ctx.textAlign = "right";
      ctx.fillText(`LIVES: ${"♥".repeat(livesRef.current)}`, CANVAS_WIDTH - 40, 40);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, highScore]);

  // Bind Listeners
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keysPressed.current.ArrowLeft = true;
      if (e.key === "ArrowRight") keysPressed.current.ArrowRight = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keysPressed.current.ArrowLeft = false;
      if (e.key === "ArrowRight") keysPressed.current.ArrowRight = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const scaleX = CANVAS_WIDTH / rect.width;
      paddleX.current = relativeX * scaleX - paddleWidth.current / 2;
      paddleX.current = Math.max(0, Math.min(CANVAS_WIDTH - paddleWidth.current, paddleX.current));
    };

    const handleTouchMove = (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const relativeX = touch.clientX - rect.left;
      const scaleX = CANVAS_WIDTH / rect.width;
      paddleX.current = relativeX * scaleX - paddleWidth.current / 2;
      paddleX.current = Math.max(0, Math.min(CANVAS_WIDTH - paddleWidth.current, paddleX.current));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [gameState]);

  const x = 120 - progress * 260;

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 overflow-hidden" id="about">
      <TextScrollBackground />
      <div className="space-y-4 pb-8 relative z-10">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Text Clip Scroll</p>
        <h2 className="max-w-3xl text-3xl font-semibold md:text-5xl" style={{ fontFamily: "var(--font-serif)" }}>
          Builder mindset. Systems thinking. Product velocity.
        </h2>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card p-0 relative z-10 overflow-hidden aspect-[1200/420] w-full flex flex-col justify-center items-center shadow-inner">
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            {/* Background static SVG Name Mask */}
            <div className="w-full h-full p-4 md:p-8 flex items-center justify-center select-none">
              <svg viewBox="0 0 1200 420" className="w-full overflow-visible">
                <defs>
                  <clipPath id="portfolio-clip">
                    <text x={x} y="220" style={{ fontSize: "170px", fontWeight: 700, fontFamily: "var(--font-serif)" }}>
                      YUVRAJ
                    </text>
                    <text x={x + 40} y="350" style={{ fontSize: "140px", fontWeight: 600, fontFamily: "var(--font-sans)" }}>
                      SHARMA
                    </text>
                  </clipPath>
                </defs>
                <image
                  href={clipImage.src}
                  width="1200"
                  height="420"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#portfolio-clip)"
                />
                <rect width="1200" height="420" fill="none" stroke="currentColor" opacity="0.18" />
              </svg>
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleStartGame}
                className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold tracking-widest text-primary-foreground shadow-lg hover:scale-105 transition active:scale-95 uppercase"
                data-cursor-label="Start Game"
              >
                Launch Breakout Arcade
              </button>
              <p className="mt-3 text-xs tracking-wider text-muted-foreground uppercase">
                Drag or use Arrow keys to control
              </p>
            </div>
          </div>
        )}

        {gameState === "playing" && (
          <div className="w-full h-full relative group">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="w-full h-full bg-[#020204] block cursor-none"
            />
            {/* Quick exit bar overlay on hover */}
            <button
              onClick={handleExitGame}
              className="absolute top-4 right-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-1.5 text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              Exit Arcade
            </button>
          </div>
        )}

        {(gameState === "gameover" || gameState === "victory") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020204] text-center p-6 select-none font-mono">
            <h3 className={`text-4xl md:text-6xl font-bold uppercase tracking-widest ${gameState === "victory" ? "text-green-500" : "text-rose-600"}`}>
              {gameState === "victory" ? "Victory!" : "Game Over"}
            </h3>
            <p className="mt-4 text-lg text-muted-foreground uppercase">
              Final Score: <span className="text-white font-bold">{score}</span>
            </p>
            {score >= highScore && score > 0 && (
              <p className="mt-1 text-sm text-yellow-500 uppercase tracking-widest animate-pulse">
                New High Score!
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleStartGame}
                className="rounded-full bg-primary px-8 py-3 text-sm font-semibold tracking-wider text-primary-foreground hover:scale-105 transition uppercase"
              >
                Play Again
              </button>
              <button
                onClick={handleExitGame}
                className="rounded-full border border-border px-8 py-3 text-sm font-semibold tracking-wider text-foreground hover:bg-white/5 transition uppercase"
              >
                Close Arcade
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
