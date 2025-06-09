// Inisialisasi peta
const map = L.map("map").setView([-8.4937, 140.4018], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>    contributors',
}).addTo(map);

let markers = [];

function updateWisataList(filterCategory = "") {
  const listContainer = document.getElementById("wisata-list");
  listContainer.innerHTML = "";

  // Filter berdasarkan kategori
  const filtered = wisata.filter(
    (item) => filterCategory === "" || item.category === filterCategory
  );

  filtered.forEach((lokasi) => {
    const popupContent = `
      <b>${lokasi.name}</b><br>
      <p>${lokasi.desc}</p>
      <p><i>${lokasi.history}</i></p>
      <img class='popup-img' src='${lokasi.img}' alt='${lokasi.name}'>
    `;
    const marker = L.marker([lokasi.lat, lokasi.lon])
      .bindPopup(popupContent)
      .addTo(map);
    marker.wisataName = lokasi.name.toLowerCase();

    const listItem = document.createElement("li");
    listItem.innerHTML = `<button class="w-full bg-green-50 border border-green-700 rounded-md p-3 text-left hover:bg-green-100 transition">
        <strong class="text-green-800">${lokasi.name}</strong><br>
        <small>${lokasi.desc}</small><br>
        <em class="text-sm text-gray-600">${lokasi.history}</em>
      </button>`;
    // Tombol tetap memakai querySelector
    listItem.querySelector("button").addEventListener("click", () => {
      map.setView([lokasi.lat, lokasi.lon], 13);
      marker.openPopup();
    });

    listContainer.appendChild(listItem);
    markers.push(marker);
  });
}

// Fungsi pencarian
document.getElementById("search-box").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  markers.forEach((marker) => {
    const match = marker.wisataName.includes(query);
    marker.setOpacity(match ? 1 : 0.2);
  });
});

// Fungsi filter kategori
document
  .getElementById("category-filter")
  .addEventListener("change", function () {
    markers.forEach((marker) => marker.removeFrom(map));
    markers = [];
    updateWisataList(this.value);
  });

// Jalankan fungsi awal
updateWisataList();
