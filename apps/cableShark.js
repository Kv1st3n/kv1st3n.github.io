let trackedNetworkActivities = [];
const maxEvents = 30;
let captureIntervalId = null;
let packetCounter = 0;

let stats = {
    total: 0,
    byType: {}
};

const PACKET_TYPES = {
    HTTP: {
        label: "Unencrypted HTTP GET Request",
        type: "http",
        severity: "normal",
        protocol: "TCP",
        defaultPort: 80
    },
    TLS: {
        label: "TLS Client Hello (Encrypted Handshake)",
        type: "tls",
        severity: "normal",
        protocol: "TCP",
        defaultPort: 443
    },
    UDP: {
        label: "DNS Query (UDP)",
        type: "udp",
        severity: "normal",
        protocol: "UDP",
        defaultPort: 53
    },
    ARP: {
        label: "ARP Broadcast Query",
        type: "arp",
        severity: "normal",
        protocol: "ARP",
        defaultPort: null
    },
    TCP_WARN: {
        label: "Suspicious Outbound Connection",
        type: "tcp-warn",
        severity: "suspicious",
        protocol: "TCP",
        defaultPort: 4444
    },
    MALFORMED: {
        label: "Malformed Packet — Checksum Failed",
        type: "malformed",
        severity: "abnormal",
        protocol: "TCP",
        defaultPort: 8080
    }
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
    packetCounter = 0;

    stats = { 
        total: 0, 
        byType: {} 
    };

    resetStatsPane(windowEl);
    liveCapture(windowEl);

}

function liveCapture(windowEl) {
    captureIntervalId = setInterval(() => {
        networkEvents(windowEl);
    }, 1500);
}

function networkEvents(windowEl) {
    const selectedPacket = pickPacketType();
    const packet = buildPacket(selectedPacket);

    updateTrackedNetwork(packet);
    updateCablesharkEvents(windowEl);
}

function pickPacketType() {
    // Generates a clean integer between 1 and 100
    let minValue = 1;
    let maxValue = 100;
    const randomNetworkEvent = Math.random() * (maxValue - minValue + 1) + minValue;

    if (randomNetworkEvent <= 55) {
        return PACKET_TYPES.HTTP;
    }
    else if (randomNetworkEvent <= 75) {
        return PACKET_TYPES.TLS;
    }
    else if (randomNetworkEvent <= 90) {
        return PACKET_TYPES.UDP;
    }
    else if (randomNetworkEvent <= 96) {
        return PACKET_TYPES.ARP;
    }
    else if (randomNetworkEvent <= 99) {
        return PACKET_TYPES.TCP_WARN;
    }
    else {
        return PACKET_TYPES.MALFORMED;
    }
}

function randomInt(minValue, maxValue) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildRandomIP() {
    return `${randInt(1, 255)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;
}

function buildPacket(packetType) {
    packetCounter += 1;

    const hasPorts = packetType.protocol === "TCP" || packetType.protocol === "UDP";

    return {
        uid: `packet-${packetCounter}`,
        type: packetType.type,
        label: packetType.label,
        severity: packetType.severity,
        protocol: packetType.protocol,
        srcIP: randomIP(),
        dstIP: randomIP(),
        srcPort: hasPorts ? randInt(1024, 65535) : null,
        dstPort: hasPorts ? (packetType.defaultPort ?? randInt(1, 65535)) : null,
        size: randInt(64, 1500),
        timestamp: new Date()
    };
}

function updateTrackedNetwork(packet) {
    trackedNetworkActivities.push(packet);

    stats.total += 1;
    stats.byType[packet.type] = (stats.byType[packet.type] || 0) + 1;

    if (trackedNetworkActivities.length > maxEvents) {
        trackedNetworkActivities.shift();
    }
}

function formatPacketLine(packet) {
    const statusWord =
        packet.severity === "abnormal" ? "Abnormal" :
        packet.severity === "suspicious" ? "Suspicious" :
        "Normal";

    const time = packet.timestamp.toLocaleTimeString();

    const addressPart = packet.srcPort !== null
        ? `${packet.srcIP}:${packet.srcPort} → ${packet.dstIP}:${packet.dstPort}`
        : `${packet.srcIP} → ${packet.dstIP}`;

    return `${statusWord} · ${packet.label} · ${addressPart} · ${time}`;
}

function updateCablesharkEvents(windowEl) {
    const eventDisplay = windowEl.querySelector('.cable-shark-top-pane');

    if (!eventDisplay) {
        return;
    }

    eventDisplay.innerHTML = '';

    trackedNetworkActivities.forEach(packet => {
        const pTag = document.createElement('p');
        pTag.className = `network-activity packet-type-${packet.type}`;
        pTag.id = packet.uid;
        pTag.textContent = formatPacketLine(packet);

        pTag.addEventListener('click', () => showPacketDetails(windowEl, packet));

        eventDisplay.appendChild(pTag);
    });

    eventDisplay.scrollTop = eventDisplay.scrollHeight;
}

function showPacketDetails(windowEl, packet) {
    const statsPane = windowEl.querySelector('.cable-shark-bottom-pane');
    
    if (!statsPane) {
        return;
    }

    const sourceLine = packet.srcPort !== null
        ? `${packet.srcIP}:${packet.srcPort}`
        : packet.srcIP;

    const destLine = packet.dstPort !== null
        ? `${packet.dstIP}:${packet.dstPort}`
        : packet.dstIP;

    statsPane.innerHTML = `
        <p class="network-stats"><strong>Packet Detail</strong></p>
        <p class="network-stats">Protocol: ${packet.protocol}</p>
        <p class="network-stats">Source: ${sourceLine}</p>
        <p class="network-stats">Destination: ${destLine}</p>
        <p class="network-stats">Size: ${packet.size} bytes</p>
        <p class="network-stats">Captured: ${packet.timestamp.toLocaleTimeString()}</p>
        <hr class="pane-divider">
        <p class="network-stats">Total packets seen: ${stats.total}</p>
    `;
}

export function closeCableShark() {
    if (captureIntervalId) {
        clearInterval(captureIntervalId);
    }
}

function resetStatsPane(windowEl) {
    const statsPane = windowEl.querySelector('.cable-shark-bottom-pane');
    if (statsPane) {
        statsPane.innerHTML = `<p class="network-stats">Click a packet to inspect it.</p>`;
    }
}

function checkPacketStatus() {
    console.log("Hello");
}
