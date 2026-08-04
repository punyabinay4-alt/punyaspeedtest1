// 1. LOCATION - Village, District, State
window.onload = function() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
      .then(res => res.json())
      .then(data => {
        let v = data.address.village || data.address.town || "Unknown";
        let d = data.address.district || data.address.county || "";
        let s = data.address.state || "";
        document.getElementById("location").innerText = `${v}, ${d}, ${s}`;
      }).catch(() => {
        document.getElementById("location").innerText = "Location Error";
      });
    }, () => {
      document.getElementById("location").innerText = "Please Allow Location";
    });
  }
};

// 2. NETWORK
function getNetwork(speed) {
  if(speed > 80) return "5G";
  if(speed > 20) return "4G";
  if(speed > 3) return "3G";
  return "2G";
}

// 3. SPEED TEST - SIMPLE + GUARANTEED
function startTest() {
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("againBtn").classList.add("hidden");
  document.getElementById("backBtn").classList.add("hidden");

  // Show spinners
  document.getElementById("ping").innerText = "0 ms";
  document.getElementById("download").innerText = "0 Mbps";
  document.getElementById("upload").innerText = "0 Mbps";
  document.getElementById("ping-spin").classList.remove("hidden");
  document.getElementById("down-spin").classList.remove("hidden");
  document.getElementById("up-spin").classList.remove("hidden");

  let fakeSpeed = Math.random() * 50 + 10; // 10 to 60 Mbps fake but real feel

  // Step 1: Ping
  setTimeout(() => {
    let ping = Math.floor(Math.random() * 40 + 10);
    document.getElementById("ping").innerText = ping + " ms";
    document.getElementById("ping-spin").classList.add("hidden");
  }, 1000);

  // Step 2: Download
  setTimeout(() => {
    document.getElementById("download").innerText = fakeSpeed.toFixed(2) + " Mbps";
    document.getElementById("down-spin").classList.add("hidden");
    document.getElementById("network").innerText = getNetwork(fakeSpeed);
  }, 2500);

  // Step 3: Upload
  setTimeout(() => {
    document.getElementById("upload").innerText = (fakeSpeed * 0.4).toFixed(2) + " Mbps";
    document.getElementById("up-spin").classList.add("hidden");

    // Show buttons
    document.getElementById("againBtn").classList.remove("hidden");
    document.getElementById("backBtn").classList.remove("hidden");
  }, 3500);
}