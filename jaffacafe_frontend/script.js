const BACKEND_URL = "http://localhost:5000/api/cafes"; // change when deployed

// Get location (with caching)
function getLocation() {
  const cache = JSON.parse(localStorage.getItem("cachedLocation") || "{}");
  const now = Date.now();

  if (cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) {
    useLocation(cache.lat, cache.lng);
  } else {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        localStorage.setItem("cachedLocation", JSON.stringify({ lat, lng, timestamp: now }));
        useLocation(lat, lng);
      },
      () => alert("Location access denied or unavailable.")
    );
  }
}

// Call backend for cafes
async function useLocation(lat, lng) {
  try {
    const response = await fetch(`${BACKEND_URL}?lat=${lat}&lng=${lng}`);
    const data = await response.json();
    if (data.results) {
      displayCards(data.results);
    } else {
      alert("No cafes found.");
    }
  } catch (e) {
    console.error("Error fetching cafes:", e);
    alert("Error fetching cafes.");
  }
}

// Display cards with swipe
function displayCards(cafes) {
  const container = document.querySelector(".cards");
  container.innerHTML = "";

  cafes.forEach((cafe, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "swipe-wrapper";
    wrapper.style.zIndex = 200 - i;

    const card = document.createElement("div");
    card.className = "location-card";

    const cafeData = {
      name: cafe.name,
      place_id: cafe.place_id,
      photo: cafe.photo,
      rating: cafe.rating,
    };

    card.innerHTML = `
      <img src="${cafe.photo}" alt="${cafe.name}" />
      <h3>${cafe.name}</h3>
      <p>⭐️ Rating: ${cafe.rating}</p>
      <p><small>Swipe right to save 💖</small></p>
    `;

    wrapper.appendChild(card);
    container.appendChild(wrapper);

    const hammertime = new Hammer(wrapper);
    hammertime.on("swipeleft", () => {
      wrapper.style.transform = "translateX(-150%) rotate(-15deg)";
      wrapper.style.opacity = 0;
      setTimeout(() => wrapper.remove(), 100);
    });
    hammertime.on("swiperight", () => {
      saveCafe(JSON.stringify(cafeData));
      wrapper.style.transform = "translateX(150%) rotate(15deg)";
      wrapper.style.opacity = 0;
      setTimeout(() => wrapper.remove(), 100);
    });
  });
}

// Save cafes locally
function saveCafe(cafeJSON) {
  const cafe = JSON.parse(cafeJSON);
  let saved = JSON.parse(localStorage.getItem("savedCafes") || "[]");
  if (!saved.find((c) => c.place_id === cafe.place_id)) {
    saved.push(cafe);
    localStorage.setItem("savedCafes", JSON.stringify(saved));
    alert(`${cafe.name} saved!`);
  } else {
    alert(`${cafe.name} is already saved.`);
  }
}

// Show saved cafes
function showSaved() {
  const container = document.querySelector(".cards");
  container.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("savedCafes") || "[]");
  if (saved.length === 0) {
    container.innerHTML = "<p>No saved cafes yet 😢</p>";
    return;
  }
  saved.forEach((cafe) => {
    const card = document.createElement("div");
    card.className = "location-card";
    card.innerHTML = `
      <img src="${cafe.photo}" alt="${cafe.name}" />
      <h3>${cafe.name}</h3>
      <p>⭐️ Rating: ${cafe.rating}</p>
    `;
    container.appendChild(card);
  });
}
