import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Explicitly allow public public endpoints to pass through without session validation
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/generate-config(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

// 2. Optimized compilation-safe matcher rules
export const config = {
  matcher: [
    // Protects all operational routes except static files, assets, and internal chunks
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Always execute middleware on API or trpc route pipelines
    "/(api|trpc)(.*)"
  ],
};