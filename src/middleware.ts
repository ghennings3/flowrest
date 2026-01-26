import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Definimos que a rota "/" é pública
const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect(); // Adicionamos o await aqui
  }
});

export const config = {
  matcher: [
    // Padrão recomendado pelo Clerk para Next.js
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
