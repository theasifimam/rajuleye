const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "http",
                hostname: "192.168.1.11",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/v1/:path*",
                destination: "http://192.168.1.11:5000/api/v1/:path*",
            },
            {
                source: "/uploads/:path*",
                destination: "http://192.168.1.11:5000/uploads/:path*",
            },
        ];
    },
};
export default nextConfig;
