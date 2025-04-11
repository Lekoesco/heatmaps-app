let map;
let trafficLayer;
let markers = [];
let routePolyline;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 38.2466, lng: 21.7346 },
    zoom: 14,
    disableDefaultUI: true,
  });

  const savedRoute = sessionStorage.getItem("savedRoute");
  if (savedRoute) {
    const decodedPath = google.maps.geometry.encoding.decodePath(savedRoute);
    routePolyline = new google.maps.Polyline({
      path: decodedPath,
      geodesic: true,
      strokeColor: "#1e90ff",
      strokeOpacity: 0.9,
      strokeWeight: 5,
    });
    routePolyline.setMap(map);
  }

  const input = document.getElementById("autocomplete");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;
    if (markers.length >= 2) {
      markers.forEach((m) => m.setMap(null));
      markers = [];
    }

    const marker = new google.maps.Marker({
      position: place.geometry.location,
      map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });

    markers.push(marker);
    map.setCenter(place.geometry.location);
    map.setZoom(15);
  });

  trafficLayer = new google.maps.TrafficLayer();
  document.getElementById("traffic-b").addEventListener("click", () => {
    trafficLayer.setMap(trafficLayer.getMap() ? null : map);
  });

  map.addListener("click", (event) => {
    if (markers.length >= 2) {
      markers.forEach(m => m.setMap(null));
      markers = [];
    }

    const marker = new google.maps.Marker({
      position: event.latLng,
      map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      icon: {
        url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png",
        scaledSize: new google.maps.Size(27, 43),
      },
    });

    markers.push(marker);
  });

  findMe();

  document.getElementById("reset-map").addEventListener("click", () => {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    if (routePolyline) routePolyline.setMap(null);
    routePolyline = null;
    sessionStorage.removeItem("savedRoute");
    map.setCenter({ lat: 38.2466, lng: 21.7346 });
    map.setZoom(14);
  });
}

function findMe() {
    if (!navigator.geolocation) return;
  
    navigator.geolocation.getCurrentPosition((position) => {
      const userPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
  
      const marker = new google.maps.Marker({
        position: userPos,
        map,
        icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        draggable: true,
      });
  
      map.setCenter(userPos);
      map.setZoom(15);
  
      if (markers.length >= 2) {
        markers.forEach((m) => m.setMap(null));
        markers = [];
      }
  
      markers.push(marker);
  
      displayWeather(userPos.lat, userPos.lng);
    });
  }
  

function calculateRoute() {
  if (markers.length < 2) {
    alert("❌ Επιλέξτε 2 σημεία!");
    return;
  }

  const origin = markers[0].getPosition();
  const destination = markers[1].getPosition();
  const travelMode = document.getElementById("travel-mode").value;

  const requestBody = {
    origin: { location: { latLng: { latitude: origin.lat(), longitude: origin.lng() } } },
    destination: { location: { latLng: { latitude: destination.lat(), longitude: destination.lng() } } },
    travelMode,
    routingPreference: travelMode === "DRIVE" ? "TRAFFIC_AWARE_OPTIMAL" : "ROUTING_PREFERENCE_UNSPECIFIED",
    computeAlternativeRoutes: false,
  };

  fetch("https://routes.googleapis.com/directions/v2:computeRoutes?key=AIzaSyAUJt1EB3nSL3D9FUXk5S0eeSTdSZPrMvY", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.steps",
    },
    body: JSON.stringify(requestBody),
  })
    .then(res => res.json())
    .then(data => {
      const route = data.routes[0];
      const decoded = google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline);

      if (routePolyline) routePolyline.setMap(null);
      routePolyline = new google.maps.Polyline({
        path: decoded,
        strokeColor: "#1e90ff",
        strokeOpacity: 0.9,
        strokeWeight: 5,
      });
      routePolyline.setMap(map);
      sessionStorage.setItem("savedRoute", route.polyline.encodedPolyline);

      const durationMin = Math.ceil(route.duration.split("s")[0] / 60);
      const distanceKm = (route.distanceMeters / 1000).toFixed(2);

      showDirectionsModal(route.legs[0].steps, durationMin, distanceKm);
      displayWeather(destination.lat(), destination.lng());
    });
}

function showDirectionsModal(steps, durationMin, distanceKm) {
  const modal = document.createElement("div");
  modal.id = "modal-overlay";
  modal.innerHTML = `
    <div id="modal-content">
      <span id="close-modal">&times;</span>
      <h3>📍 Οδηγίες</h3>
      <p>Απόσταση: ${distanceKm} km | Χρόνος: ~${durationMin} λεπτά</p><hr>
    </div>`;

  steps.forEach((step) => {
    const div = document.createElement("div");
    div.className = "direction-step";
    div.innerHTML = `
      <div class="step-icon">➡️</div>
      <div class="step-text">${step.navigationInstruction.instructions}</div>
    `;
    modal.querySelector("#modal-content").appendChild(div);
  });

  document.body.appendChild(modal);
  document.getElementById("close-modal").onclick = () => modal.remove();
}

function displayWeather(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=el&appid=5d5f7548e8cdd14df5be5cac4d613e0d`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("weather-panel").innerHTML = `
        <h3>☁️ Καιρός</h3>
        <p>${data.name}</p>
        <p>🌡️ ${data.main.temp}°C</p>
        <p>💧 ${data.main.humidity}% - ${data.weather[0].description}</p>`;
    });
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("hide");
}