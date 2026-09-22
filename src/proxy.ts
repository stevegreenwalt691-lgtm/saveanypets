import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const LOGIN_PATH = "/admin/login";

export async function proxy(request: NextRequest) {
  const { supabase, response, user } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === LOGIN_PATH;

  if (isAdminRoute && !isLoginRoute) {
    if (!user) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }

    const { data: staff } = await supabase.rpc("is_staff");
    if (!staff) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
