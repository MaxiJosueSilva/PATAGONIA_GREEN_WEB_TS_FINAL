import { Node, Link } from './types';

export function drawNode(ctx: CanvasRenderingContext2D, node: Node) {
  const { x, y, width, height, color, label, cornerRadius = 5 } = node;
  if (width === 0 && height === 0) return;

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - width / 2 + cornerRadius, y - height / 2);
  ctx.arcTo(x + width / 2, y - height / 2, x + width / 2, y + height / 2, cornerRadius);
  ctx.arcTo(x + width / 2, y + height / 2, x - width / 2, y + height / 2, cornerRadius);
  ctx.arcTo(x - width / 2, y + height / 2, x - width / 2, y - height / 2, cornerRadius);
  ctx.arcTo(x - width / 2, y - height / 2, x + width / 2, y - height / 2, cornerRadius);
  ctx.closePath();

  ctx.shadowBlur = 15;
  ctx.shadowColor = '#00f';

  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  label.split('\n').forEach((line, index) => ctx.fillText(line, x, y + index * 20));
}

export function drawLink(ctx: CanvasRenderingContext2D, link: Link) {
  const { from, to, label, fromControlPoint, toControlPoint } = link;
  const cp1x = from.x + (to.x - from.x) / 2 + fromControlPoint.x;
  const cp1y = from.y + (to.y - from.y) / 2 + fromControlPoint.y;
  const cp2x = from.x + (to.x - from.x) / 2 + toControlPoint.x;
  const cp2y = from.y + (to.y - from.y) / 2 + toControlPoint.y;

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, to.x, to.y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(label, (from.x + to.x) / 2, (from.y + to.y) / 2);
}

function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

export function animatePackets(ctx: CanvasRenderingContext2D, links: Link[], time: number) {
  links.forEach(link => {
    const { speed, packetColor, packetSize, from, to, fromControlPoint, toControlPoint, numPackets } = link;
    const t = ((time % (speed * 10000)) / (speed * 10000));

    const cp1x = from.x + (to.x - from.x) / 2 + fromControlPoint.x;
    const cp1y = from.y + (to.y - from.y) / 2 + fromControlPoint.y;
    const cp2x = from.x + (to.x - from.x) / 2 + toControlPoint.x;
    const cp2y = from.y + (to.y - from.y) / 2 + toControlPoint.y;

    for (let i = 0; i < numPackets; i++) {
      const offset = (i / numPackets) * (speed * 10000);
      const packetT = (t + offset / (speed * 10000)) % 1;
      const packetX = cubicBezier(packetT, from.x, cp1x, cp2x, to.x);
      const packetY = cubicBezier(packetT, from.y, cp1y, cp2y, to.y);

      ctx.fillStyle = packetColor;
      ctx.globalAlpha = 0.6;
      ctx.shadowColor = packetColor;
      ctx.shadowBlur = 10;
      ctx.fillRect(packetX - packetSize.width / 2, packetY - packetSize.height / 2, packetSize.width, packetSize.height);
      ctx.globalAlpha = 1.0;
    }
  });
}