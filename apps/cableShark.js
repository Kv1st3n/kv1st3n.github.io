let trackedNetworkActivities = [];

export function initCableShark() {

}

function setupCableSharkListener () {
    const udpTraffic = document.getElementById('udp-traffic');
    const tcpTraffic = document.getElementById('tcp-traffic');
    const httpTraffic = document.getElementById('http-traffic');
    const nonHttpTraffic = document.getElementById('non-http-traffic');
    const arpTraffic = document.getElementById('arp-traffic');
    const seriousTcpTraffic = document.getElementById('serious-tcp-traffic');
    const malformedTraffic = document.getElementById('malformed-traffic');
}

function liveCapture() {

}

function networkEvents() {

}

// make an array
// use time-based intervall, with some randomness to add / and delete (older) events
// for each event display the new activity in html / css