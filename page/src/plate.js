// Hero plate: a Lissajous table drawn like a copper engraving.
// Columns sweep the x frequency, rows the y frequency, and the phase drifts slowly.

const canvas = document.getElementById('plate');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COLS = 3;
const ROWS = 4;
const POINTS = 360;
const SPEED = 0.18; // radians of phase per second

let width = 0;
let height = 0;
let dpr = 1;
let ink = '#16140F';
let paper = '#F2EEE5';
let muted = '#6B665B';
let texture = null;
let phase = Math.PI / 4;
let running = false;
let last = 0;

function readColors() {
    const style = getComputedStyle(document.documentElement);
    ink = style.getPropertyValue('--ink').trim() || ink;
    paper = style.getPropertyValue('--surface').trim() || paper;
    muted = style.getPropertyValue('--muted').trim() || muted;
}

// Diagonal hatching and a double rule frame, rendered once per size or theme.
function buildTexture() {
    texture = document.createElement('canvas');
    texture.width = width * dpr;
    texture.height = height * dpr;
    const t = texture.getContext('2d');
    t.scale(dpr, dpr);

    t.fillStyle = paper;
    t.fillRect(0, 0, width, height);

    t.save();
    t.beginPath();
    t.rect(0, 0, width, height);
    t.clip();
    t.strokeStyle = ink;
    t.lineWidth = 0.6;
    t.globalAlpha = 0.09;
    for (let x = -height; x < width; x += 5) {
        t.beginPath();
        t.moveTo(x, height);
        t.lineTo(x + height, 0);
        t.stroke();
    }
    t.restore();

    // Cell rules
    const { cellW, cellH, ox, oy } = layout();
    t.strokeStyle = ink;
    t.globalAlpha = 0.22;
    t.lineWidth = 1;
    for (let c = 1; c < COLS; c++) {
        const x = Math.round(ox + c * cellW) + 0.5;
        t.beginPath();
        t.moveTo(x, oy);
        t.lineTo(x, oy + ROWS * cellH);
        t.stroke();
    }
    for (let r = 1; r < ROWS; r++) {
        const y = Math.round(oy + r * cellH) + 0.5;
        t.beginPath();
        t.moveTo(ox, y);
        t.lineTo(ox + COLS * cellW, y);
        t.stroke();
    }
    t.globalAlpha = 1;
}

function layout() {
    const pad = 12;
    return {
        ox: pad,
        oy: pad,
        cellW: (width - 2 * pad) / COLS,
        cellH: (height - 2 * pad) / ROWS,
    };
}

function trace(cx, cy, rx, ry, a, b, offset) {
    ctx.beginPath();
    for (let i = 0; i <= POINTS; i++) {
        const t = (i / POINTS) * Math.PI * 2;
        const x = cx + rx * Math.sin(a * t + offset);
        const y = cy + ry * Math.sin(b * t);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(texture, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { cellW, cellH, ox, oy } = layout();
    const r = Math.min(cellW, cellH) * 0.32;
    ctx.lineJoin = 'round';
    ctx.font = '500 12px "Geist Mono", ui-monospace, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const a = col + 1;
            const b = row + 1;
            const cx = ox + (col + 0.5) * cellW;
            const cy = oy + (row + 0.5) * cellH + 6;
            const offset = phase * (1 + 0.15 * (col + row));

            // Paper knockout so the hatching does not run through the figure
            ctx.fillStyle = paper;
            ctx.beginPath();
            ctx.ellipse(cx, cy, r * 1.14, r * 1.14, 0, 0, Math.PI * 2);
            ctx.fill();

            // A faint offset pass reads as the burr of an engraved line
            ctx.strokeStyle = ink;
            ctx.globalAlpha = 0.22;
            ctx.lineWidth = 1;
            trace(cx + 1.5, cy + 1.5, r, r, a, b, offset);

            ctx.globalAlpha = 1;
            ctx.lineWidth = 1.25;
            trace(cx, cy, r, r, a, b, offset);

            ctx.fillStyle = muted;
            ctx.fillText(`${a}:${b}`, ox + col * cellW + 8, oy + row * cellH + 8);
        }
    }
}

function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    readColors();
    buildTexture();
    draw();
}

function frame(now) {
    if (!running) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    phase += dt * SPEED;
    draw();
    requestAnimationFrame(frame);
}

function start() {
    if (running || reduceMotion) return;
    running = true;
    last = 0;
    requestAnimationFrame(frame);
}

function stop() {
    running = false;
}

new ResizeObserver(resize).observe(canvas);

document.addEventListener('themechange', () => {
    readColors();
    buildTexture();
    draw();
});

// Only animate while the plate is on screen.
new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
}).observe(canvas);

// Redraw once the mono font has loaded so the labels use it.
if (document.fonts) {
    document.fonts.ready.then(() => width && draw());
}
