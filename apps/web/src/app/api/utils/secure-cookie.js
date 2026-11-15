export function useSecureCookie() {
  return (process.env.AUTH_URL ?? "").startsWith("https");
}
