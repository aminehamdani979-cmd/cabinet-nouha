import { NextResponse } from "next/server";

/**
 * POST /api/admin/auth
 *
 * Simple password-based gate for the admin dashboard.
 * On success, sets an httpOnly cookie that the admin page checks client-side
 * via a lightweight verification call. This is intentionally simple: the
 * real data protection is enforced by Supabase RLS (service role key never
 * leaves the server, anon key cannot write to admin tables).
 *
 * Set ADMIN_PASSWORD in your environment variables.
 */
export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: "ADMIN_PASSWORD n'est pas configuré sur le serveur." },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: "Mot de passe incorrect." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set("cn_admin_session", adminPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[POST /api/admin/auth] Error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur d'authentification." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/auth
 * Verifies whether the current session cookie is valid.
 */
export async function GET(request: Request) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/cn_admin_session=([^;]+)/);
    const session = match ? decodeURIComponent(match[1]) : null;

    const authenticated = !!adminPassword && session === adminPassword;

    return NextResponse.json({ success: true, authenticated }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/auth] Error:", error);
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/auth
 * Logs out by clearing the session cookie.
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set("cn_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
