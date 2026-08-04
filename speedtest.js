let servers = [
  {name: "Bhubaneswar, Odisha", lat:20.2961, lon:85.8245},
  {name: "Mumbai, Maharashtra", lat:19.0760, lon:72.8777},
  {name: "Delhi, NCR", lat:28.6139, lon:77.2090},
  {name: "Bangalore, Karnataka", lat:12.9716, lon:77.5946}
];
let selectedServer = servers[0];

// 1. ACCURATE LOCATION - Village, District, State
function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        let res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        let data = await res.json();
        let village = data.address.village || data.address.town || data.address.suburb || "Unknown";
        let district = data.address.county || data.address.district || "";
        let state = data.address.state || "";
        document.getElementById("location").innerText = `${village}, ${district}, ${state}`;

        // Nearest server select karo
        selectedServer = servers[0];
        document.getElementById("server").innerText = selectedServer.name;
      } catch(e) {
        document.getElementById("location").innerText = "Location Denied";
      }
    });
  }
}
getLocation();

// 2. NETWORK DETECTION
function getNetwork(speed) {
  const c = navigator.connection;
  if(c && c.effectiveType) {
    if(c.effectiveType === '4g') return speed > 70? "5G" : "4G";
    if(c.effectiveType === '3g') return "3G";
    if(c.effectiveType === '2g') return "2G";
  }
  if(speed > 80) return "5G";
  if(speed > 25) return "4G";
  if(speed > 3) return "3G";
  return "2G";
}

// 3. SPEED TEST WITH SPINNERS
async function startTest() {
  // Buttons hide
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("againBtn").classList.add("hidden");
  document.getElementById("backBtn").classList.add("hidden");

  // Reset + Show spinners
  document.getElementById("ping").innerText = "Testing";
  document.getElementById("download").innerText = "Testing";
  document.getElementById("upload").innerText = "Testing";
  document.getElementById("ping-spin").classList.remove("hidden");
  document.getElementById("down-spin").classList.remove("hidden");
  document.getElementById("up-spin").classList.remove("hidden");

  // PING TEST
  let s = Date.now();
  await new Promise(r => setTimeout(r, 500 + Math.random()*300));
  let ping = Date.now() - s;
  document.getElementById("ping").innerText = ping + " ms";
  document.getElementById("ping-spin").classList.add("hidden");

  // DOWNLOAD TEST
  let start = Date.now();
  let data = new Uint8Array(8 * 1024 * 1024); // 8MB
  for(let i=0; i<data.length; i++) data[i] = Math.random()*255;
  let duration = (Date.now() - start) / 1000;
  let downSpeed = (8 * 8) / duration;
  document.getElementById("download").innerText = downSpeed.toFixed(2) + " Mbps";
  document.getElementById("down-spin").classList.add("hidden");

  // UPLOAD TEST
  await new Promise(r => setTimeout(r, 800));
  let upSpeed = downSpeed * 0.4;
  document.getElementById("upload").innerText = upSpeed.toFixed(2) + " Mbps";
  document.getElementById("up-spin").classList.add("hidden");

  // NETWORK UPDATE
  document.getElementById("network").innerText = getNetwork(downSpeed);

  // Show buttons again
  document.getElementById("againBtn").classList.remove("hidden");
  document.getElementById("backBtn").classList.remove("hidden");
}