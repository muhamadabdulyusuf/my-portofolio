import { useRef, useState, useEffect } from "react";
import Matter from "matter-js";
import "./FallingText.css";

// === WARNA LOGO LO ===
const colorPalette = [
  "#1B2096",
  "#DADADA",
  "#EC6632",
  "#16CCC3",
  "#89497D",
  "#105B9E",
];

const FallingText = ({
  className = "",
  text = "",
  highlightWords = [],
  highlightClass = "highlighted",
  trigger = "scroll",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 2,
  mouseConstraintStiffness = 0.2,
  fontSize = "1rem",
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const bodiesRef = useRef([]);

  const [effectStarted, setEffectStarted] = useState(false);

  // ========= GENERATE WORDS + RANDOM COLOR ==========
  const generateWordsHTML = () => {
    const words = text.split(" ");
    return words
      .map((word) => {
        const isHighlighted = highlightWords.some((hw) => word.startsWith(hw));
        const randomColor =
          colorPalette[Math.floor(Math.random() * colorPalette.length)];
        return `
          <span class="word ${isHighlighted ? highlightClass : ""}"
            style="color:${randomColor};">
            ${word}
          </span>
        `;
      })
      .join(" ");
  };

  // === SET TEXT PERTAMA KALI ===
  useEffect(() => {
    if (textRef.current) {
      textRef.current.innerHTML = generateWordsHTML();
    }
  }, [text]);

  // === HANDLE SCROLL MASUK VIEWPORT ===
  useEffect(() => {
    if (trigger !== "scroll") return;
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startEffect();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [trigger]);

  // === HANDLE TRIGGER CLICK / HOVER ===
  const handleTrigger = () => {
    if (!effectStarted && (trigger === "click" || trigger === "hover")) {
      startEffect();
    }
  };

  // ===================================================
  //                PHYSICS START EFFECT
  // ===================================================
  const startEffect = () => {
    if (effectStarted) return;
    setEffectStarted(true);

    setTimeout(() => setupPhysics(), 50);
  };

  // ===================================================
  //                SETUP PHYSICS ENGINE
  // ===================================================
  const setupPhysics = () => {
    if (!containerRef.current || !textRef.current) return;
    cleanupPhysics();

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } =
      Matter;

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;
    engineRef.current = engine;

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes,
      },
    });
    renderRef.current = render;

    const runner = Runner.create();
    runnerRef.current = runner;

    // ======= BOUNDARIES (INVISIBLE WALLS) =======
    const boundary = { isStatic: true, render: { fillStyle: "transparent" } };
    const wallThickness = 50;

    const floor = Bodies.rectangle(
      width / 2,
      height + wallThickness / 2,
      width + wallThickness * 2,
      wallThickness,
      boundary
    );
    const ceiling = Bodies.rectangle(
      width / 2,
      -wallThickness / 2,
      width + wallThickness * 2,
      wallThickness,
      boundary
    );
    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height + wallThickness * 2,
      boundary
    );
    const rightWall = Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height + wallThickness * 2,
      boundary
    );

    // ======= WORD BODIES =======
    const wordSpans = textRef.current.querySelectorAll(".word");
    bodiesRef.current = [];

    const wordBodies = [...wordSpans].map((elem) => {
      const rect = elem.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        restitution: 0.8,
        frictionAir: 0.02,
        friction: 0.1,
        render: { fillStyle: "transparent" },
      });

      elem.dataset.body = body.id;

      Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

      bodiesRef.current.push({ elem, body });
      elem.style.position = "absolute";

      return body;
    });

    // ===== ADD ALL OBJECTS =====
    World.add(engine.world, [floor, ceiling, leftWall, rightWall, ...wordBodies]);

    // ===== MOUSE DRAG =====
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false },
      },
    });
    World.add(engine.world, mouseConstraint);

    // ===== RUN =====
    Runner.run(runner, engine);
    Render.run(render);

    // ===== UPDATE LOOP (CLAMP WORDS) =====
    const updateLoop = () => {
      bodiesRef.current.forEach(({ body, elem }) => {
        const halfW = elem.offsetWidth / 2;
        const halfH = elem.offsetHeight / 2;

        // clamp posisi ke container
        body.position.x = Math.max(halfW, Math.min(body.position.x, width - halfW));
        body.position.y = Math.max(halfH, Math.min(body.position.y, height - halfH));

        elem.style.left = `${body.position.x}px`;
        elem.style.top = `${body.position.y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });

      requestAnimationFrame(updateLoop);
    };

    updateLoop();
  };

  // ===================================================
  //                   SCROLL HANDLER
  // ===================================================
  useEffect(() => {
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const curr = window.scrollY;

      if (curr < lastScroll) {
        resetEffect(); // scroll up → reset
      } else if (curr > lastScroll) {
        if (!effectStarted) startEffect(); // scroll down → restart
      }

      lastScroll = curr;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [effectStarted]);

  // === RESET FUNCTION ===
  const resetEffect = () => {
    cleanupPhysics();
    if (textRef.current) textRef.current.innerHTML = generateWordsHTML();
    setEffectStarted(false);
  };

  // ===================================================
  //              CLEANUP ENGINE & WORLD
  // ===================================================
  const cleanupPhysics = () => {
    const engine = engineRef.current;
    const render = renderRef.current;
    const runner = runnerRef.current;

    if (render) {
      Matter.Render.stop(render);
      if (render.canvas && canvasContainerRef.current)
        canvasContainerRef.current.removeChild(render.canvas);
    }
    if (runner) Matter.Runner.stop(runner);
    if (engine) {
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
    }

    engineRef.current = null;
    renderRef.current = null;
    runnerRef.current = null;
    bodiesRef.current = [];
  };

  // ===================================================
  //                    RENDER JSX
  // ===================================================
  return (
    <div
      ref={containerRef}
      className={`falling-text-container ${className}`}
      onClick={trigger === "click" ? handleTrigger : undefined}
      onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        ref={textRef}
        className="falling-text-target"
        style={{ fontSize, lineHeight: 1.4 }}
      ></div>
      <div ref={canvasContainerRef} className="falling-text-canvas"></div>
    </div>
  );
};

export default FallingText;
