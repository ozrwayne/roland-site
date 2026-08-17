import { useEffect, useRef } from "react";
import "./SVGFollowerCursor.css";

const DEFAULT_COLORS = ["#ffffff", "#90ee90", "#89cff0", "#f6bc4f", "#ec612c"];
const createSvgElement = tag => document.createElementNS("http://www.w3.org/2000/svg", tag);

export default function SVGFollowerCursor({ colors = DEFAULT_COLORS, removeDelay = 320, className = "" }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!svg || !finePointer.matches || reducedMotion.matches || window.innerWidth <= 767) return undefined;

    const shapeTimers = new Set();

    class Follower {
      constructor(color, index) {
        this.points = [];
        this.color = color;
        this.line = createSvgElement("path");
        this.line.setAttribute("fill", color);
        this.line.setAttribute("stroke", color);
        this.line.setAttribute("stroke-width", "0.75");
        this.line.setAttribute("opacity", index === colors.length - 1 ? "0.72" : "0.9");
        svg.appendChild(this.line);
      }

      add(position, direction) {
        const point = {
          position,
          time: performance.now(),
          drift: {
            x: (Math.random() - 0.5) * 3 + direction.x * 0.5,
            y: (Math.random() - 0.5) * 3 + direction.y * 0.5,
          },
          age: 0,
          direction,
        };
        this.points.unshift(point);
        if (Math.random() < 0.12) this.makeShape(point);
      }

      makeShape(point) {
        const speed = Math.abs(point.direction.x) + Math.abs(point.direction.y);
        if (speed < 1.6) return;
        const variants = ["circle", "rect", "polygon"];
        const shape = createSvgElement(variants[Math.floor(Math.random() * variants.length)]);
        const size = Math.min(18, Math.max(4, speed * 1.15));

        if (shape.tagName === "circle") shape.setAttribute("r", String(size * 0.45));
        else if (shape.tagName === "rect") {
          shape.setAttribute("width", String(size));
          shape.setAttribute("height", String(size));
          shape.setAttribute("x", String(-size / 2));
          shape.setAttribute("y", String(-size / 2));
        } else {
          shape.setAttribute("points", `0,${-size / 2} ${size / 2},${size / 2} ${-size / 2},${size / 2}`);
        }

        shape.setAttribute("fill", this.color);
        shape.setAttribute("opacity", "0.9");
        shape.style.transformOrigin = "center";
        shape.style.transform = `translate(${point.position.x}px, ${point.position.y}px)`;
        shape.style.transition = "transform 420ms cubic-bezier(.2,.75,.35,1), opacity 420ms ease";
        svg.appendChild(shape);

        const timer = window.setTimeout(() => {
          shape.style.opacity = "0";
          shape.style.transform = `translate(${point.position.x + point.direction.x * 12 + point.drift.x * 8}px, ${point.position.y + point.direction.y * 12 + point.drift.y * 8}px) scale(0) rotate(${Math.random() * 260 - 130}deg)`;
          const cleanupTimer = window.setTimeout(() => {
            shape.remove();
            shapeTimers.delete(cleanupTimer);
          }, 430);
          shapeTimers.add(cleanupTimer);
          shapeTimers.delete(timer);
        }, 16);
        shapeTimers.add(timer);
      }

      draw(now) {
        while (this.points.length && this.points[this.points.length - 1].time < now - removeDelay) this.points.pop();
        if (!this.points.length) {
          this.line.setAttribute("d", "");
          return;
        }

        const path = ["M"];
        let forward = true;
        let index = 0;
        while (index >= 0) {
          const point = this.points[index];
          const depth = (index - this.points.length) / this.points.length;
          const offsetX = point.direction.x * depth * 0.65;
          const offsetY = point.direction.y * depth * 0.65;
          point.age += 0.18;
          path.push(String(point.position.x + (forward ? offsetY : -offsetY) + point.drift.x * point.age));
          path.push(String(point.position.y + (forward ? offsetX : -offsetX) + point.drift.y * point.age));
          index += forward ? 1 : -1;
          if (index === this.points.length) {
            index -= 1;
            forward = false;
          }
        }
        this.line.setAttribute("d", path.join(" "));
      }

      destroy() {
        this.line.remove();
      }
    }

    const followers = colors.map((color, index) => new Follower(color, index));
    let previous = null;
    let animationFrame = 0;
    let lastAddedAt = 0;

    const onPointerMove = event => {
      const position = { x: event.clientX, y: event.clientY };
      if (!previous) previous = position;
      const limit = value => Math.max(-8, Math.min(8, value));
      const direction = {
        x: limit((position.x - previous.x) * 0.16),
        y: limit((position.y - previous.y) * 0.16),
      };
      const now = performance.now();
      if (now - lastAddedAt > 9) {
        followers.forEach(follower => follower.add(position, direction));
        lastAddedAt = now;
      }
      previous = position;
    };

    const animate = now => {
      followers.forEach(follower => follower.draw(now));
      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    animationFrame = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(animationFrame);
      shapeTimers.forEach(timer => window.clearTimeout(timer));
      followers.forEach(follower => follower.destroy());
      svg.replaceChildren();
    };
  }, [colors, removeDelay]);

  return <svg ref={svgRef} className={`svg-follower-cursor ${className}`} aria-hidden="true" focusable="false" />;
}
