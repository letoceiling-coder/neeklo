// Canvas animation - optimized for performance
let ctx: CanvasRenderingContext2D | null = null;
let animationId: number | null = null;
let isRunning = false;
let frame = 1;

interface Position {
  x: number;
  y: number;
}

const pos: Position = { x: 0, y: 0 };
let lines: Line[] = [];

const E = {
  friction: 0.5,
  trails: 50, // Reduced for better performance
  size: 30,   // Reduced for better performance
  dampening: 0.025,
  tension: 0.99,
};

class Oscillator {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;
  value: number = 0;

  constructor(opts: Partial<{ phase: number; offset: number; frequency: number; amplitude: number }> = {}) {
    this.phase = opts.phase || 0;
    this.offset = opts.offset || 0;
    this.frequency = opts.frequency || 0.001;
    this.amplitude = opts.amplitude || 1;
  }

  update(): number {
    this.phase += this.frequency;
    this.value = this.offset + Math.sin(this.phase) * this.amplitude;
    return this.value;
  }
}

class Node {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
}

class Line {
  spring: number;
  friction: number;
  nodes: Node[] = [];

  constructor(opts: { spring: number }) {
    this.spring = opts.spring + 0.1 * Math.random() - 0.05;
    this.friction = E.friction + 0.01 * Math.random() - 0.005;
    
    for (let i = 0; i < E.size; i++) {
      const node = new Node();
      node.x = pos.x;
      node.y = pos.y;
      this.nodes.push(node);
    }
  }

  update() {
    let spring = this.spring;
    let node = this.nodes[0];
    node.vx += (pos.x - node.x) * spring;
    node.vy += (pos.y - node.y) * spring;

    for (let i = 0; i < this.nodes.length; i++) {
      node = this.nodes[i];
      if (i > 0) {
        const prev = this.nodes[i - 1];
        node.vx += (prev.x - node.x) * spring;
        node.vy += (prev.y - node.y) * spring;
        node.vx += prev.vx * E.dampening;
        node.vy += prev.vy * E.dampening;
      }
      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
      spring *= E.tension;
    }
  }

  draw() {
    if (!ctx) return;
    
    let x = this.nodes[0].x;
    let y = this.nodes[0].y;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let i = 1; i < this.nodes.length - 2; i++) {
      const curr = this.nodes[i];
      const next = this.nodes[i + 1];
      x = 0.5 * (curr.x + next.x);
      y = 0.5 * (curr.y + next.y);
      ctx.quadraticCurveTo(curr.x, curr.y, x, y);
    }

    const secondLast = this.nodes[this.nodes.length - 2];
    const last = this.nodes[this.nodes.length - 1];
    ctx.quadraticCurveTo(secondLast.x, secondLast.y, last.x, last.y);
    ctx.stroke();
    ctx.closePath();
  }
}

let oscillator: Oscillator | null = null;

function handleMouseMove(e: MouseEvent | TouchEvent) {
  if ('touches' in e && e.touches.length > 0) {
    pos.x = e.touches[0].pageX;
    pos.y = e.touches[0].pageY;
  } else if ('clientX' in e) {
    pos.x = e.clientX;
    pos.y = e.clientY;
  }
}

function initLines() {
  lines = [];
  for (let i = 0; i < E.trails; i++) {
    lines.push(new Line({ spring: 0.45 + (i / E.trails) * 0.025 }));
  }
}

function onFirstInteraction(e: MouseEvent | TouchEvent) {
  document.removeEventListener('mousemove', onFirstInteraction);
  document.removeEventListener('touchstart', onFirstInteraction);
  
  handleMouseMove(e);
  initLines();
  
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('touchmove', handleMouseMove, { passive: true });
  
  if (!isRunning) {
    isRunning = true;
    render();
  }
}

function render() {
  if (!ctx || !isRunning) return;

  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = 'lighter';
  
  const hue = oscillator ? Math.round(oscillator.update()) : 200;
  ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.025)`;
  ctx.lineWidth = 10;

  for (const line of lines) {
    line.update();
    line.draw();
  }

  frame++;
  animationId = window.requestAnimationFrame(render);
}

function resizeCanvas() {
  if (!ctx) return;
  ctx.canvas.width = window.innerWidth - 20;
  ctx.canvas.height = window.innerHeight;
}

export function renderCanvas() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  isRunning = true;
  frame = 1;

  oscillator = new Oscillator({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });

  // Use passive listeners for better scroll performance
  document.addEventListener('mousemove', onFirstInteraction, { passive: true });
  document.addEventListener('touchstart', onFirstInteraction, { passive: true });
  
  window.addEventListener('resize', resizeCanvas, { passive: true });
  document.body.addEventListener('orientationchange', resizeCanvas);

  // Pause when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else if (lines.length > 0) {
      isRunning = true;
      render();
    }
  });

  resizeCanvas();
}

export function stopCanvas() {
  isRunning = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}
