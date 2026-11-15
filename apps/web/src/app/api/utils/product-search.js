/**
 * Product lookup used to enrich the Gemini recommendations.
 * Default provider is SerpAPI Google Shopping (`SERPAPI_KEY`).
 * Set `PRODUCT_SEARCH_PROVIDER=none` to skip lookup.
 * Missing credentials return an empty list so analysis still succeeds.
 *
 * Results use the shape the rest of the route already reads:
 * product_id, product_title, product_photos, product_rating,
 * product_num_reviews, product_page_url, offer.{price, store_name, offer_page_url, shipping}.
 */

export function mapSerpApiShoppingResults(results, minRating = 4) {
  if (!Array.isArray(results)) return [];

  return results
    .filter((item) => {
      if (item?.rating == null || item.rating === "") return true;
      const rating = Number(item.rating);
      return Number.isFinite(rating) && rating >= minRating;
    })
    .map((item) => ({
      product_id: item.product_id || String(item.position ?? ""),
      product_title: item.title || "Skincare product",
      product_photos: item.thumbnail ? [item.thumbnail] : [],
      product_rating: item.rating ?? null,
      product_num_reviews: item.reviews ?? 0,
      product_page_url: item.product_link || item.link || null,
      offer: {
        price:
          item.price ||
          (item.extracted_price != null ? `$${item.extracted_price}` : "N/A"),
        store_name: item.source || "Google Shopping",
        offer_page_url: item.link || item.product_link || null,
        shipping: item.delivery || null,
      },
    }));
}

export async function searchProducts(query, { minRating = 4, page = 1 } = {}) {
  const provider = (process.env.PRODUCT_SEARCH_PROVIDER || "serpapi")
    .trim()
    .toLowerCase();

  if (!query || provider === "none" || provider === "off") {
    return [];
  }

  if (provider !== "serpapi") {
    console.warn(
      `[Product Search] Unknown PRODUCT_SEARCH_PROVIDER "${provider}". Returning no products.`,
    );
    return [];
  }

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    console.warn(
      "[Product Search] SERPAPI_KEY is not set. Returning no products.",
    );
    return [];
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", process.env.SERPAPI_ENGINE || "google_shopping");
  url.searchParams.set("q", query);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("num", "10");
  if (page > 1) {
    url.searchParams.set("start", String((page - 1) * 10));
  }

  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `SerpAPI request failed (${response.status}): ${text.slice(0, 300)}`,
    );
  }

  const data = await response.json();
  return mapSerpApiShoppingResults(data.shopping_results, minRating);
}
