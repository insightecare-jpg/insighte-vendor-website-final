import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const protectedRoutes: Record<string, string[]> = {
  "/parent": ["client"],
  "/provider": ["expert", "provider"],
  "/admin": ["admin"],
};

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Only initialize Supabase if credentials are present to avoid hard crash
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Skipping auth check in middleware.");
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Allow auth and public paths
  const isPublicPath = 
    pathname.startsWith("/auth") || 
    pathname.startsWith("/login") || 
    pathname.startsWith("/signup") || 
    pathname === "/" ||
    pathname.startsWith("/api");

  // Protect paths based on role
  let isProtected = false;
  let requiredRoles: string[] = [];
  let authType: "admin" | "expert" | "client" = "client";
  
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      isProtected = true;
      requiredRoles = roles;
      if (route === "/admin") authType = "admin";
      else if (route === "/provider") authType = "expert";
      else authType = "client";
      break;
    }
  }

  // Only perform auth check if it's a protected path OR we need to redirect away from auth pages
  const needsAuthCheck = isProtected || (!isPublicPath && (pathname.startsWith("/auth") || ["/login", "/register", "/signup"].includes(pathname)));

  let activeUser = null;
  let appRole = undefined;

  if (needsAuthCheck) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // BYPASS MECHANISM FOR DEVELOPMENT
    const devRole = request.cookies.get('insighte-dev-role')?.value;
    activeUser = user;
    appRole = user?.app_metadata?.app_role as string | undefined;

    if (!user && devRole && process.env.NODE_ENV === 'development') {
      appRole = devRole;
      activeUser = { id: '00000000-0000-0000-0000-000000000000', email: `dev-${devRole}@insighte.com` } as any;
    }
  }

  if (isPublicPath) {
    return supabaseResponse;
  }

  if (isProtected) {
    if (!activeUser) {
      const url = request.nextUrl.clone();
      url.pathname = `/auth/${authType}/login`;
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    
    if (!appRole || !requiredRoles.includes(appRole)) {
      const url = request.nextUrl.clone();
      if (appRole === "provider") url.pathname = "/provider/dashboard";
      else if (appRole === "admin") url.pathname = "/admin/dashboard";
      else url.pathname = "/parent/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (activeUser && (pathname.startsWith("/auth") || ["/login", "/register", "/signup"].includes(pathname)) && !pathname.includes("callback")) {
    const url = request.nextUrl.clone();
    if (appRole === "provider") url.pathname = "/provider/dashboard";
    else if (appRole === "admin") url.pathname = "/admin/dashboard";
    else url.pathname = "/parent/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
