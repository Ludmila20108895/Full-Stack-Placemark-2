console.log("Map script loaded");

document.addEventListener("DOMContentLoaded", async () => {
  const map = L.map("map"); // Initialize the map

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
  }).addTo(map);

  const res = await fetch("/api/pois"); // Fetch POIs from the API
  const pois = await res.json();

  const bounds = L.latLngBounds(); // To store all POI locations

  pois.forEach((poi) => {
    if (poi.latitude && poi.longitude) {
      const visitDate = moment(poi.visitDate).format("D MMM YYYY");

      const marker = L.marker([poi.latitude, poi.longitude]).addTo(map);
      marker.bindPopup(`
        <div style="min-width: 180px">
          <strong>${poi.name}</strong><br>
          ${poi.category}<br>
          <small><strong>Visited:</strong> ${visitDate}</small><br>
          <a href="/pois/${poi._id}" class="button is-small is-link mt-2">View Place</a>
        </div>
      `); // Popup content

      bounds.extend([poi.latitude, poi.longitude]);
    }
  });

  // Set the map view to fit all markers
  if (bounds.isValid()) {
    map.fitBounds(bounds.pad(0.1));
  } else {
    // If no valid bounds, set a default view
    map.setView([53.4, -7.8], 6);
  }
});
