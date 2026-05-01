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
        return [
            {
                source: "/api/v1/:path*",
                destination: "http://localhost:5000/api/v1/:path*",
            },
            {
                source: "/uploads/:path*",
                destination: "http://localhost:5000/uploads/:path*",
            },
        ];
    },
};
export default nextConfig;
