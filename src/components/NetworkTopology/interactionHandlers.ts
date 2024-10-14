export function handleMouseInteractions(canvas: HTMLCanvasElement, updateCallback: (zoom: number, x: number, y: number) => void) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let zoomLevel = 1;
  let canvasX = 0;
  let canvasY = 0;

  function onMouseDown(e: MouseEvent) {
    isDragging = true;
    startX = e.clientX - canvasX;
    startY = e.clientY - canvasY;
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    canvasX = e.clientX - startX;
    canvasY = e.clientY - startY;
    updateCallback(zoomLevel, canvasX, canvasY);
  }

  function onMouseUp() {
    isDragging = false;
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault();

    const mouseX = e.clientX - canvasX;
    const mouseY = e.clientY - canvasY;

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoomLevel = Math.min(Math.max(zoomLevel + delta, 0.5), 2);

    const offsetX = (mouseX - canvasX) * (newZoomLevel / zoomLevel - 1);
    const offsetY = (mouseY - canvasY) * (newZoomLevel / zoomLevel - 1);

    canvasX -= offsetX;
    canvasY -= offsetY;
    zoomLevel = newZoomLevel;

    updateCallback(zoomLevel, canvasX, canvasY);
  }

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('wheel', onWheel);

  return () => {
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('wheel', onWheel);
  };
}