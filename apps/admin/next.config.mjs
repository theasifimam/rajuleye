import fs from "fs";
import path from "path";

// Manually parse root .env file
const rootEnvPath = path.resolve(process.cwd(), "../../.env");
if (fs.existsSync(rootEnvPath)) {
    const envContent = fs.readFileSync(rootEnvPath, "utf-8");
    envContent.split("\n").forEach((line) => {
        const [key, ...value] = line.split("=");
        if (key && value.length > 0) {
            const trimmedKey = key.trim();
            const trimmedValue = value.join("=").trim().replace(/^["']|["']$/g, "");
            if (trimmedKey && !process.env[trimmedKey]) {
                process.env[trimmedKey] = trimmedValue;
            }
        }
    });
}

const nextConfig = {
    output: "standalone",
    /* config options here */
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
