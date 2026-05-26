import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which paths skip authentication validations completely
const isPublicRoute = createRouteMatcher([
  "/api/generate-config(.*)", 
  "/"
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect(); // Protects all other routes automatically
  }
});

export const config = {
  matcher: [
    // Skips internal Next.js static asset routes and images seamlessly
    '/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest))).*)',
    '/(api|trpc)(.*)',
  ],
};