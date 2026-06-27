const draggableElements = document.querySelectorAll(".draggable-window");
const popupOverlay = document.getElementById('desktop-programs-overlay');

/* will make windows popup on click whenever a user clicks on a program*/
function launchProgram(element) {
    if (element.classList.contains('my-trashbin')) {
        popupOverlay.classList.add('active');
    }
}

/* Will make the opened window close by turning its visibility to none*/
function closeProgram() {
    popupOverlay.classList.remove('active');
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeProgram);
}

/* This script makes it so that the programs are draggable where the onDrag is used to update the position of the program */

draggableElements.forEach((element) => {
    let offsetX = 0;
    let offsetY = 0;

  element.addEventListener('pointerdown', (e) => {
    draggableElements.forEach(el => el.style.zIndex = "5");
    element.style.zIndex = "10";

    element.setPointerCapture(e.pointerId);
    
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    
    // updates the position
    const onDrag = (moveEvent) => {
        element.style.position = 'absolute';
        element.style.margin = '0'; 
        element.style.left = `${moveEvent.clientX - offsetX}px`;
        element.style.top = `${moveEvent.clientY - offsetY}px`;
    };

    // once the pointer stops dragging, the program will be placed on the new position
    const stopElementDrag = (upEvent) => {
        element.releasePointerCapture(upEvent.pointerId);
        window.removeEventListener('pointermove', onDrag);
        window.removeEventListener('pointerup', stopElementDrag);
    };

        window.addEventListener('pointermove', onDrag);
        window.addEventListener('pointerup', stopElementDrag);
    });

    element.addEventListener('dblclick', () => {
        launchProgram(element);
    });

});
