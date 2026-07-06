//import { initTrashBin } from './apps/trashbin.js';
import { initCableShark, closeCableShark } from './apps/cableShark.js';
import { initFinance } from './apps/finance.js';
//import { initDataScience} from './apps/dataScience.js';

//initTrashBin();
initFinance();
//initDataScience();

const draggableElements = document.querySelectorAll(".draggable-window");
const popupOverlay = document.getElementById('desktop-programs-overlay');
const allProgramWindows = document.querySelectorAll('.program-window');

/* will make windows popup on click whenever a user clicks on a program*/
function launchProgram(element) {
    popupOverlay.classList.add('active');

    allProgramWindows.forEach(win => win.style.zIndex = "5");

    let targetWin = null;

    if (element.classList.contains('my-trashbin')) {
        targetWin = document.getElementById('prog-trashbin');
    }
    else if (element.classList.contains('my-computer')) {
        targetWin = document.getElementById('prog-computer');
    }
    else if (element.classList.contains('my-empty-folder')) {
        targetWin = document.getElementById('prog-empty-folder');
    }
    else if (element.classList.contains('my-projects-folder')) {
        targetWin = document.getElementById('prog-project-folder');
    }
    else if (element.classList.contains('my-cable-shark')) {
        targetWin = document.getElementById('prog-cable-shark');
        initCableShark();
    }
    else if (element.classList.contains('my-data-science')) {
        targetWin = document.getElementById('prog-data-science');
    }
    else if (element.classList.contains('my-finance')) {
        targetWin = document.getElementById('prog-finance-app');
    }

    if (targetWin) {
        targetWin.classList.add('active');
        targetWin.style.zIndex = "10";
    }
}


/* Will make the opened window close by turning its visibility to none*/
function closeProgram(e) {
    const windowEl = e.target.closest('.program-window');
    if (!windowEl) {
        return;
    }

    windowEl.classList.remove('active');
    windowEl.style.top = '';
    windowEl.style.left = '';

    if (windowEl.id === 'prog-cable-shark') {
        closeCableShark();
    }

    // only hide the whole overlay once nothing is left open
    const anyStillOpen = Array.from(allProgramWindows).some(w => w.classList.contains('active'));
    if (!anyStillOpen) {
        popupOverlay.classList.remove('active');
    }
}

const closeBtn = document.querySelectorAll('.close-btn');
closeBtn.forEach((btn) => {
    btn.addEventListener('click', closeProgram);
});

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

    element.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        launchProgram(element);
    });
});


const draggablePrograms = document.querySelectorAll(".draggable-program");

draggablePrograms.forEach((program) => {
    let programOffsetX = 0;
    let programOffsetY = 0;

    program.addEventListener('pointerdown', (e) => {
        
        if (e.target.closest('.close-btn')) {
            return;
        }

        if (e.target.closest('.network-activity')) {
            return;
        }

        program.setPointerCapture(e.pointerId);
        
        programOffsetX = e.clientX - program.offsetLeft;
        programOffsetY = e.clientY - program.offsetTop;

        const onProgramDrag = (moveEvent) => {
            program.style.left = `${moveEvent.clientX - programOffsetX}px`;
            program.style.top = `${moveEvent.clientY - programOffsetY}px`;
        };

        const stopProgramDrag = (upEvent) => {
            program.releasePointerCapture(upEvent.pointerId);
            window.removeEventListener('pointermove', onProgramDrag);
            window.removeEventListener('pointerup', stopProgramDrag);
        };

        window.addEventListener('pointermove', onProgramDrag);
        window.addEventListener('pointerup', stopProgramDrag);
    });
});

const resizers = document.querySelectorAll('.program-resizer');

resizers.forEach((handle) => {
    handle.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();


        const windowElement = handle.closest('.program-window');
        
        const startWidth = windowElement.offsetWidth;
        const startHeight = windowElement.offsetHeight;
        const startX = e.clientX;
        const startY = e.clientY;

        const resizeWindow = (moveEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX);
            const newHeight = startHeight + (moveEvent.clientY - startY);

            if (newWidth > 200) {
                windowElement.style.width = newWidth + 'px';

                const innerShell = windowElement.querySelector('.my-trashbin-prog, .my-computer-prog, .my-empty-folder-prog, .my-project-folder-prog, .my-cable-shark-prog, .my-data-science-prog, .my-finance-prog');
                if (innerShell) innerShell.style.width = '100%';
            }
            if (newHeight > 120) {
                windowElement.style.height = newHeight + 'px';
            }
        };

        const stopResize = () => {
            document.removeEventListener('pointermove', resizeWindow);
            document.removeEventListener('pointerup', stopResize);
        };

        document.addEventListener('pointermove', resizeWindow);
        document.addEventListener('pointerup', stopResize);

    });
});
