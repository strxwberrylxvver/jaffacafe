import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

app.get("/api/cafes", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing lat/lng" });
  }

  try {
    const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=cafe&key=${API_KEY}`;
    const response = await fetch(endpoint);
    const data = await response.json();

    // photo URLs
    const cafes = data.results.map((cafe) => {
      const photoUrl = cafe.photos?.[0]?.photo_reference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${cafe.photos[0].photo_reference}&key=${API_KEY}`
        : "https://via.placeholder.com/250x150?text=No+Image";

      return {
        name: cafe.name,
        place_id: cafe.place_id,
        rating: cafe.rating || "N/A",
        photo: photoUrl,
      };
    });

    res.json({ results: cafes });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch cafes" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
