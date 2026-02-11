import { getToken } from "@auth/core/jwt";
import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { hash, verify } from "argon2";
import { SignJWT } from "jose";

export async function GET(request) {
  const [token, jwt] = await Promise.all([
    getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL.startsWith("https"),
      raw: true,
    }),
    getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL.startsWith("https"),
    }),
  ]);

  if (!jwt) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Create a custom JWT token for mobile app usage
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const customToken = await new SignJWT({
    sub: jwt.sub,
    email: jwt.email,
    name: jwt.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);

  return new Response(
    JSON.stringify({
      jwt: customToken, // Return custom JWT instead of raw session token
      user: {
        id: jwt.sub,
        email: jwt.email,
        name: jwt.name,
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name, action } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (action === "signup") {
      // Sign up - create new account
      if (!name) {
        return Response.json(
          { error: "Name is required for sign up" },
          { status: 400 },
        );
      }

      // Check if user already exists
      const existingUser = await sql`
        SELECT id FROM auth_users WHERE LOWER(email) = LOWER(${email})
      `;

      if (existingUser.length > 0) {
        return Response.json(
          { error: "An account with this email already exists" },
          { status: 400 },
        );
      }

      // Hash password
      const hashedPassword = await hash(password);

      // Create user
      const [newUser] = await sql`
        INSERT INTO auth_users (name, email, "emailVerified")
        VALUES (${name}, ${email}, NOW())
        RETURNING id, name, email
      `;

      // Create credentials account
      await sql`
        INSERT INTO auth_accounts ("userId", type, provider, "providerAccountId", password)
        VALUES (${newUser.id}, 'credentials', 'credentials', ${email}, ${hashedPassword})
      `;

      // Create session
      const sessionToken = crypto.randomUUID();
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await sql`
        INSERT INTO auth_sessions ("userId", "sessionToken", expires)
        VALUES (${newUser.id}, ${sessionToken}, ${expires})
      `;

      // Create JWT
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      const token = await new SignJWT({
        sub: newUser.id.toString(),
        email: newUser.email,
        name: newUser.name,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("30d")
        .sign(secret);

      return Response.json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
        token,
        sessionToken,
      });
    } else if (action === "signin") {
      // Sign in - validate credentials
      const [user] = await sql`
        SELECT u.id, u.name, u.email, a.password
        FROM auth_users u
        JOIN auth_accounts a ON a."userId" = u.id
        WHERE LOWER(u.email) = LOWER(${email})
        AND a.type = 'credentials'
        AND a.provider = 'credentials'
      `;

      if (!user) {
        return Response.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      // Verify password
      const isValid = await verify(user.password, password);

      if (!isValid) {
        return Response.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      // Create or update session
      const sessionToken = crypto.randomUUID();
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await sql`
        INSERT INTO auth_sessions ("userId", "sessionToken", expires)
        VALUES (${user.id}, ${sessionToken}, ${expires})
      `;

      // Create JWT
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      const token = await new SignJWT({
        sub: user.id.toString(),
        email: user.email,
        name: user.name,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("30d")
        .sign(secret);

      return Response.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
        sessionToken,
      });
    } else {
      return Response.json(
        { error: "Invalid action. Must be 'signin' or 'signup'" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Auth error:", error);
    return Response.json({ error: "Authentication failed" }, { status: 500 });
  }
}
