export default function leafletSetup() {
  const map = new L.Map("map");

  // Erzeuge eine Karte mit Attribution
  var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  var osmAtt = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
  var args = { minZoom: 8, maxZoom: 19, attribution: osmAtt };
  var osm = new L.TileLayer(osmUrl, args);

  // Hochschule Bremerhaven
  map.setView(new L.LatLng(53.54, 8.5835), 17);

  // Fuege den osm TileLayer zu der Karte hinzu
  map.addLayer(osm);

  let myMarker;
  map.on("locationfound", function (ev) {
      myMarker = L.marker(ev.latlng);
      myMarker.addTo(map);
      return
  });

  myMarker = L.marker([53.54, 8.5835], { title: "Hochschule" });
  myMarker.bindPopup("Hochschule Bremerhaven");
  myMarker.addTo(map);
}
