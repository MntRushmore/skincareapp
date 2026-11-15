import { auth } from "@/auth";
import { jwtVerify } from "jose";

/**
 * Web requests carry an Auth.js session cookie. The Expo app sends the JWT
 * issued by POST /api/auth/token in the Authorization header.
 */
export async function getRequestUser(request) {
  try {
    const session = await auth();
    if (session?.user?.id) {
      return {
        id: session.user.id.toString(),
        email: session.user.email ?? null,
        name: session.user.name ?? null,
      };
    }
  } catch (error) {
    console.error("Session lookup failed:", error);
  }

  const authHeader = request?.headers?.get?.("authorization");
  if (!authHeader?.startsWith("Bearer ") || !process.env.AUTH_SECRET) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const { payload } = await jwtVerify(authHeader.substring(7), secret);
    if (!payload?.sub) return null;
    return {
      id: payload.sub.toString(),
      email: typeof payload.email === "string" ? payload.email : null,
      name: typeof payload.name === "string" ? payload.name : null,
    };
  } catch (jwtError) {
    console.error("JWT verification failed:", jwtError);
    return null;
  }
}
