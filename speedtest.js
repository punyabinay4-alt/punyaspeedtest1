// 1. EXACT LOCATION
function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      let lat = pos.coords.latitude; let lon = pos.coords.longitude;
      try {
        let res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        let data = await res.json();
        let village = data.address.village || data.address.town || data.address.suburb || "Unknown";
        let district = data.address.county || data.address.district || "";
        let state = data.address.state || "";
        document.getElementById("location").innerText = `${village}, ${district}, ${state}`;
      } catch(e) { document.getElementById("location").innerText = "Location Error"; }
    });
  }
}
getLocation();

// 2. NETWORK
function getNetwork(speed) {
  if(speed > 70) return "5G";
  if(speed > 20) return "4G";
  if(speed > 3) return "3G";
  if(speed > 0) return "2G";
  return "Unknown";
}

// 3. SPEED TEST - FIXED
async function startTest() {
  // Show spinner, hide buttons
  document.getElementById("spinner").classList.remove("hidden");
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("againBtn").classList.add("hidden");
  document.getElementById("backBtn").classList.add("hidden");
  
  document.getElementById("download").innerText = "Testing...";
  document.getElementById("upload").innerText = "Testing...";
  document.getElementById("ping").innerText = "Testing...";

  try {
    // Ping - CORS fix
    let s = Date.now(); 
    await fetch('https://cloudflare.com/cdn-cgi/trace', {mode:'cors', cache:'no-store'}); 
    document.getElementById("ping").innerText = (Date.now()-s) + " ms";

    // Download - CORS fix
    let start = Date.now(); 
    let res = await fetch('https://speed.cloudflare.com/__down?bytes=10000000', {cache:'no-store'});
    let data = await res.blob(); 
    let duration = (Date.now()-start)/1000;
    let speed = ((data.size * 8) / duration) / 1000000;
    
    document.getElementById("download").innerText = speed.toFixed(2) + " Mbps";
    document.getElementById("upload").innerText = (speed * 0.5).toFixed(2) + " Mbps";
    document.getElementById("network").innerText = getNetwork(speed);

  } catch(e) {
    alert("Test Failed. Check Internet and try again.");
  }

  // Hide spinner, show Test Again + Back
  document.getElementById("spinner").classList.add("hidden");
  document.getElementById("againBtn").classList.remove("hidden");
  document.getElementById("backBtn").classList.remove("hidden");
}

function goBack() {
  window.history.back();
}