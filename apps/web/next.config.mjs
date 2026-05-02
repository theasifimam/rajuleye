const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "http",
                hostname: "localhost",
            },
        ],
    },
    async rewrites() {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        return [
            {
                source: "/api/v1/:path*",
                destination: `${apiBase}/api/v1/:path*`,
            },
            {
                source: "/uploads/:path*",
                destination: `${apiBase}/uploads/:path*`,
            },
        ];
    },
};
export default nextConfig;
