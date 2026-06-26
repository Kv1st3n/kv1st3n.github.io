const box = document.getElementById("draggable");

let offsetX = 0;
let offsetY = 0;

box.addEventListener('pointerdown', (e) => {
    box.setPointerCapture(e.pointerId);
    
    offsetX = e.clientX - box.offsetLeft;
    offsetY = e.clientY - box.offsetTop;
    
    window.addEventListener('pointermove', onDrag);
    window.addEventListener('pointerup', stopElementDrag);
});

function onDrag(e) {
    box.style.position = 'absolute';
    box.style.margin = '0';

    box.style.left = `${e.clientX - offsetX}px`;
    box.style.top = `${e.clientY - offsetY}px`;
}

function stopElementDrag(e) {
    box.releasePointerCapture(e.pointerId);
    window.removeEventListener('pointermove', onDrag);
    window.removeEventListener('pointerup', stopElementDrag);
}