const dragElement = document.getElementById("draggable");

let offsetX = 0;
let offsetY = 0;

box.addEventListener('pointerdown', (e) => {
  box.setPointerCapture(e.pointerId);
  
  offsetX = e.clientX - box.offsetLeft;
  offsetY = e.clientY - box.offsetTop;
  
  box.addEventListener('pointermove', dragElement);
  box.addEventListener('pointerup', stopElementDrag);
});

function dragElement(e) {
  box.style.left = `${e.clientX - offsetX}px`;
  box.style.top = `${e.clientY - offsetY}px`;
}

function stopElementDrag(e) {
  box.releasePointerCapture(e.pointerId);
  box.removeEventListener('pointermove', dragElement);
  box.removeEventListener('pointerup', stopElementDrag);
}
