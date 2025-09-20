import { fetchSoilData } from "../services/soilgridsService.js";
import { getCache, setCache } from "../utils/cache.js";

export const getSoilData = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.render("error", { 
        message: "Latitude and Longitude are required", 
        title: "Crazy For Earth" 
      });
    }

    const cacheKey = `${lat},${lon}`;
    let soilData = getCache(cacheKey);

    if (!soilData) {
      soilData = await fetchSoilData(lat, lon);

      if (!soilData || !soilData.properties || Object.keys(soilData.properties).length === 0) {
        // The API returned data but no soil properties for these coordinates.
        return res.render("pages/result", { 
          title: "Crazy For Earth", 
          soilData: {}, // Pass an empty object to trigger the 'else' in EJS
          lat, 
          lon 
        });
      }

      setCache(cacheKey, soilData, 600); // Cache for 10 minutes
    }

    res.render("pages/result", { 
      title: "Crazy For Earth", 
      soilData, 
      lat, 
      lon 
    });

  } catch (err) {
    console.error("SoilController error:", err);
    res.status(500).render("error", { 
      message: "Internal Server Error", 
      title: "Crazy For Earth" 
    });
  }
};
