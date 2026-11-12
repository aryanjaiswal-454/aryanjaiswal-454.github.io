import { useEffect, useRef } from "react";

interface NetworkBackdropProps {
  active: boolean;
}

export function NetworkBackdrop({ active }: NetworkBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const spacing = 126;
    let nodes: Array<{ x: number; y: number; phase: number }> = [];
    let columns = 0;
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastDraw = 0;
    const pointer = { x: 0, y: 0, active: false };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      nodes = [];
      columns = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = (column - 1) * spacing;
          const y = (row - 1) * spacing;
          const seed = Math.sin(column * 12.9898 + row * 78.233) * 43758.5453;
          const random = seed - Math.floor(seed);
          nodes.push({
            x: x + (random - 0.5) * 30,
            y: y + (Math.sin(seed) - 0.5) * 24,
            phase: random * Math.PI * 2
          });
        }
      }
    };

    const draw = (time: number, force = false) => {
      if (!force && time - lastDraw < 40) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;
      context.clearRect(0, 0, width, height);
      const animate = active && !reducedMotion.matches && !document.hidden;
      const pointerActive = animate && pointer.active;
      const points = nodes.map((node) => {
        const drift = animate ? Math.sin(time * 0.00018 + node.phase) * 3 : 0;
        const baseX = node.x + drift;
        const baseY = node.y + drift * 0.45;
        const distance = pointerActive ? Math.hypot(pointer.x - baseX, pointer.y - baseY) : Infinity;
        const influence = pointerActive ? Math.max(0, 1 - distance / (spacing * 1.8)) : 0;
        const zoom = 1 + influence * 0.075;
        return {
          x: pointerActive ? pointer.x + (baseX - pointer.x) * zoom : baseX,
          y: pointerActive ? pointer.y + (baseY - pointer.y) * zoom : baseY,
          influence
        };
      });

      points.forEach((point, index) => {
        for (const neighborIndex of [index + 1, index + columns]) {
          const neighbor = points[neighborIndex];
          if (!neighbor || Math.hypot(neighbor.x - point.x, neighbor.y - point.y) > spacing * 1.65) continue;
          const edgeGlow = Math.max(point.influence, neighbor.influence);
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(neighbor.x, neighbor.y);
          context.strokeStyle = `rgba(255, 65, 80, ${animate ? 0.11 + edgeGlow * 0.34 : 0.075})`;
          context.lineWidth = 0.7 + edgeGlow * 0.85;
          context.shadowColor = edgeGlow > 0 ? "rgba(255, 59, 78, 0.85)" : "transparent";
          context.shadowBlur = edgeGlow * 10;
          context.stroke();
          context.shadowBlur = 0;
        }
        if (pointerActive) {
          const distance = Math.hypot(pointer.x - point.x, pointer.y - point.y);
          if (distance < spacing * 1.65) {
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(pointer.x, pointer.y);
            context.strokeStyle = `rgba(255, 75, 88, ${(1 - distance / (spacing * 1.65)) * 0.38})`;
            context.lineWidth = 0.8 + point.influence * 0.65;
            context.shadowColor = "rgba(255, 59, 78, 0.9)";
            context.shadowBlur = point.influence * 12;
            context.stroke();
            context.shadowBlur = 0;
          }
        }
        context.beginPath();
        context.arc(point.x, point.y, (animate ? 1.25 : 1) + point.influence * 2.4, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 95, 105, ${animate ? 0.34 + point.influence * 0.58 : 0.23})`;
        context.shadowColor = "rgba(255, 59, 78, 0.95)";
        context.shadowBlur = point.influence * 18;
        context.fill();
        context.shadowBlur = 0;
      });

      if (animate) frame = requestAnimationFrame(draw);
      else frame = 0;
    };

    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      draw(0, true);
    };

    const onResize = () => {
      resize();
      refresh();
    };
    const onVisibilityChange = () => refresh();
    const onPointerMove = (event: PointerEvent) => {
      if (!active || reducedMotion.matches) return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      if (!frame) refresh();
    };
    const onPointerLeave = () => {
      pointer.active = false;
      if (!frame) refresh();
    };
    resize();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener("change", refresh);
    refresh();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener("change", refresh);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="network-backdrop" aria-hidden="true" />;
}
