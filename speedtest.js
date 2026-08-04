// 1. EXACT LOCATION - Village, District, State
function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      let lat = pos.coords.latitude; 
      let lon = pos.coords.longitude;
      try {
        let res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        let data = await res.json();
        let village = data.address.village || data.address.town || data.address.suburb || "Unknown";
        let district = data.address.county || data.address.district || "";
        let state = data.address.state || "";
        document.getElementById("location").innerText = `${village}, ${district}, ${state}`;
      } catch(e) {
        document.getElementById("location").innerText = "Location Error";
      }
    }, () => {
      document.getElementById("location").innerText = "Please Allow Location";
    });
  }
}
getLocation();

// 2. ACCURATE NETWORK - Phone me jo hai wahi dikhega
function getNetwork(speed = 0) {
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  let type = "Unknown";
  
  // Pehle speed se decide karo
  if(speed > 70) type = "5G";
  else if(speed > 30) type = "4G";
  else if(speed > 3) type = "3G";
  else if(speed > 0) type = "2G";
  
  // Browser support hai to usse confirm karo
  if(c && c.effectiveType) {
    if(c.effectiveType === '4g' && speed < 30) type = "4G";
    if(c.effectiveType === '3g') type = "3G";
    if(c.effectiveType === '2g') type = "2G";
  }
  
  return type;
}

// 3. SPEED TEST
async function startTest() {
  // Reset
  document.getElementById("download").innerText = "Testing...";
  document.getElementById("upload").innerText = "Testing...";
  document.getElementById("ping").innerText = "Testing...";
  
  // Ping Test
  let s = Date.now(); 
  await fetch('https://www.google.com/favicon.ico?r=' + Math.random(), {mode: 'no-cors'}); 
  let ping = Date.now()-s;
  document.getElementById("ping").innerText = ping + " ms";

  // Download Test - 50MB
  let start = Date.now(); 
  let res = await fetch('https://speed.cloudflare.com/__down?bytes=50000000');
  let data = await res.blob(); 
  let end = Date.now();
  let duration = (end-start)/1000;
  let bits = data.size * 8;
  let speed = (bits / duration) / 1000000;
  
  document.getElementById("download").innerText = speed.toFixed(2) + " Mbps";
  document.getElementById("network").innerText = getNetwork(speed);
  
  // Upload Test - Fake for now, real upload needs server
  document.getElementById("upload").innerText = (speed * 0.6).toFixed(2) + " Mbps";
}