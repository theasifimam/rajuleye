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
        const isProd = process.env.NODE_ENV === 'production';
        const apiBase = process.env.NEXT_PUBLIC_API_URL || (isProd ? '' : "http://localhost:5000");

        // If no API base is defined in production, we skip rewrites to avoid contacting localhost
        if (isProd && !apiBase) return [];

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
