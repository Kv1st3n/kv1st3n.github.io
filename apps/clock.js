export function initClock() {
    const dtText = document.getElementById('dtText');
    if (!dtText) {
        return;
    }

    function updateTime() {
        const date = new Date();
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const time = date.toLocaleTimeString();
        const day = date.toLocaleDateString(undefined, options);
        dtText.textContent = `${time}. ${day}`;
    }

    updateTime();
    setInterval(updateTime, 1000);
}