let trackedNetworkActivities = [];
const maxEvents = 30;
let captureIntervalId = null;

const PACKET_TYPES = {
    HTTP: { text: "Abnormal · Unencrypted HTTP GET Request", id: "http-traffic" },
    TLS: { text: "Normal · TLS Client Hello", id: "non-http-traffic" },
    UDP: { text: "Normal · UDP Traffic Detected", id: "udp-traffic" },
    ARP: { text: "Normal · ARP Broadcast Query", id: "arp-traffic" },
    TCP_WARN: { text: "Normal · Outbound Connection established", id: "serious-tcp-traffic" },
    MALFORMED: { text: "Normal · Checksum Validated", id: "malformed-traffic" }
};

export function initCableShark() {
    const windowEl = document.getElementById('prog-cable-shark');

    if (!windowEl) {
        return;
    }

    console.log("Cableshark Initialized...");

    if (captureIntervalId) {
        clearInterval(captureIntervalId);
    }

    const eventDisplay = windowEl.querySelector('.cable-shark-top-pane');
    if (eventDisplay) {
        eventDisplay.innerHTML = '';
    }
    trackedNetworkActivities = [];

    liveCapture(windowEl);

}

function liveCapture(windowEl) {
    captureIntervalId = setInterval(() => {
        networkEvents(windowEl);
    }, 1500);
}

function networkEvents() { 
    // Generates a clean integer between 1 and 100
    let minValue = 1;
    let maxValue = 100;
    const randomNetworkEvent = Math.random() * (maxValue - minValue + 1) + minValue;
    let selectedPacket;

    if (randomNetworkEvent <= 55) {
        selectedPacket = PACKET_TYPES.HTTP;
    } 
    else if (randomNetworkEvent <= 75) {
        selectedPacket = PACKET_TYPES.TLS;
    }
    else if (randomNetworkEvent <= 90) {
        selectedPacket = PACKET_TYPES.UDP;
    }
    else if (randomNetworkEvent <= 96) {
        selectedPacket = PACKET_TYPES.ARP;
    } 
    else if (randomNetworkEvent <= 99) {
        selectedPacket = PACKET_TYPES.TCP_WARN;
    }
    else {
        selectedPacket = PACKET_TYPES.MALFORMED;
    }

    updateTrackedNetwork(selectedPacket);
    updateCablesharkEvents(windowEl);
}

function updateTrackedNetwork(packetData) {
    trackedNetworkActivities.push(packetData);

    if (trackedNetworkActivities.length > maxEvents) {
        trackedNetworkActivities.shift();
    }
}

function updateCablesharkEvents(windowEl) {
    const eventDisplay = windowEl.querySelector('.cable-shark-top-pane');

    if (!eventDisplay) {
        return;
    }

    eventDisplay.innerHTML = '';

    trackedNetworkActivities.forEach(packet => {
        const pTag = document.createElement('p');
        pTag.className = 'network-activity';
        pTag.id = packet.id;
        pTag.textContent = packet.text;
        
        eventDisplay.appendChild(pTag);
    });

    eventDisplay.scrollTop = eventDisplay.scrollHeight;
}
