export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/v1/applications/:path*",
    "/api/v1/analytics/:path*",
  ],
};
