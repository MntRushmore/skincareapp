const originalFetch = fetch;

/**
 * Anything used to rewrite `/integrations` and create.xyz URLs through its
 * host. Those calls now go to Gemini, SerpAPI, and Uploadcare directly, so
 * fetch is a pass-through.
 */
export const fetchWithHeaders = async function fetchWithHeaders(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  return originalFetch(input, init);
};

export default fetchWithHeaders;
