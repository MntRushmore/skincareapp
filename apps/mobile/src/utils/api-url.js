export function getApiUrl() {
  return (
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.EXPO_PUBLIC_BASE_URL ||
    ""
  ).replace(/\/$/, "");
}
