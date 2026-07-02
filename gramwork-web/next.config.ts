import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Proxy API calls to the backend microservices.
  // This solves CORS issues since requests go from the Next.js server
  // (same origin) to the backend, not from the browser directly.
  async rewrites() {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8086";
    const laborerUrl = process.env.NEXT_PUBLIC_LABORER_URL || "http://localhost:8081";
    const jobUrl = process.env.NEXT_PUBLIC_JOB_URL || "http://localhost:8082";
    const assignmentUrl = process.env.NEXT_PUBLIC_ASSIGNMENT_URL || "http://localhost:8083";
    const paymentUrl = process.env.NEXT_PUBLIC_PAYMENT_URL || "http://localhost:8084";
    const attendanceUrl = process.env.NEXT_PUBLIC_ATTENDANCE_URL || "http://localhost:8087";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const notificationUrl = process.env.NEXT_PUBLIC_NOTIFICATION_URL || "http://localhost:8088";

    return [
      // Auth Service (port 8086)
      {
        source: "/api/auth/:path*",
        destination: `${authUrl}/api/auth/:path*`,
      },
      // Laborer Profile Service (port 8081) — employer endpoints
      {
        source: "/api/employer/:path*",
        destination: `${laborerUrl}/api/employer/:path*`,
      },
      // Laborer Profile Service (port 8081) — worker endpoints
      {
        source: "/api/worker/:path*",
        destination: `${laborerUrl}/api/worker/:path*`,
      },
      // Job Service (port 8082)
      {
        source: "/api/job/:path*",
        destination: `${jobUrl}/api/job/:path*`,
      },
      // Assignment Service (port 8083)
      {
        source: "/api/assignments/:path*",
        destination: `${assignmentUrl}/api/assignments/:path*`,
      },
      // Payment Service (port 8084)
      {
        source: "/api/payment/:path*",
        destination: `${paymentUrl}/api/payment/:path*`,
      },
      // Invoice (port 8084) — same service as payment
      {
        source: "/api/invoice/:path*",
        destination: `${paymentUrl}/api/invoice/:path*`,
      },
      // Attendance Service (port 8087)
      {
        source: "/api/attendance/:path*",
        destination: `${attendanceUrl}/api/attendance/:path*`,
      },
    ];
  },
};

export default nextConfig;
