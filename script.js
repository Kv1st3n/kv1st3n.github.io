const draggableElements = document.querySelectorAll(".draggable-window");

draggableElements.forEach((element) => {
    let offsetX = 0;
    let offsetY = 0;

  element.addEventListener('pointerdown', (e) => {
    draggableElements.forEach(el => el.style.zIndex = "5");
    element.style.zIndex = "10";

    element.setPointerCapture(e.pointerId);
    
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    
    const onDrag = (moveEvent) => {
        element.style.position = 'absolute';
        element.style.margin = '0'; 
        element.style.left = `${moveEvent.clientX - offsetX}px`;
        element.style.top = `${moveEvent.clientY - offsetY}px`;
    };

    const stopElementDrag = (upEvent) => {
        element.releasePointerCapture(upEvent.pointerId);
        window.removeEventListener('pointermove', onDrag);
        window.removeEventListener('pointerup', stopElementDrag);
    };

        window.addEventListener('pointermove', onDrag);
        window.addEventListener('pointerup', stopElementDrag);
  });
});