import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/applications/:path*",
    "/api/v1/analytics/:path*",
  ],
};
