import fetch from "node-fetch";

export const fetchSoilData = async (lat, lon) => {
  const url = `${process.env.SOILGRIDS_API}?lat=${encodeURIComponent(Number(lat))}&lon=${encodeURIComponent(Number(lon))}`;
  const maxAttempts = 3;
  const baseTimeout = 15000; // 15s
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeoutMs = baseTimeout * attempt; // backoff by attempt
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const start = Date.now();
    try {
      console.debug(`fetchSoilData attempt ${attempt} -> ${url} (timeout ${timeoutMs}ms)`);
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const elapsed = Date.now() - start;
      console.debug(`fetchSoilData response status ${response.status} (elapsed ${elapsed}ms)`);
      if (!response.ok) {
        const text = await response.text();
        console.error("SoilGrids API error:", response.status, text);
        // If 5xx, retry; otherwise break
        if (response.status >= 500 && attempt < maxAttempts) {
          await new Promise(r => setTimeout(r, 500 * attempt));
          continue;
        }
        return null;
      }
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const txt = await response.text();
        console.error("SoilGrids returned non-JSON response:", txt.slice(0, 1000));
        return null;
      }
      const data = await response.json();
      if (!data || !data.properties || Object.keys(data.properties).length === 0) {
        console.debug("SoilGrids response had no properties:", JSON.stringify(data).slice(0, 1000));
      }
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        console.error(`fetchSoilData error: request timed out (attempt ${attempt})`);
      } else {
        console.error(`fetchSoilData error (attempt ${attempt}):`, err);
      }
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, 500 * attempt)); // backoff
        continue;
      }
      return null;
    }
  }
};

export const fetchWRBClasses = async (lat, lon, number_classes = 5) => {
  try {
    const url = `${process.env.SOILGRIDS_API}/classes/wrb/probability?lat=${lat}&lon=${lon}&number_classes=${number_classes}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("application/json")) return null;
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("fetchWRBClasses error:", err);
    return null;
  }
};
