const apiKey = "AIzaSyCf-duGxI_5sjkp7B7jhr784RtlyWaB5Jg";
const useProxy = "true";
const proxy = "https://cors-anywhere.herokuapp.com";

function getLocation() {
  const cache = JSON.parse(localStorage.getIten("cachedLocation") || {});
  const now = Date.now();
}

if (cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) {
  useLocation(cache.lat, cache.lng);
} else {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      localStorage.setItem(
        "cachedLocation",
        JSON.stringify({ lat, lng, timestamp: now })
      );
      useLocation(lat, lng);
    },
    () => alert("Location access denied or unavailable.")
  );
}
