import app from "./app";
import { prisma } from "./lib/prisma";
let isPrismaConnected = false;
async function ensureDatabaseConnection() {
    if (!isPrismaConnected) {
        await prisma.$connect();
        isPrismaConnected = true;
        console.log("Connected to the database successfully.");
    }
}
export async function handler(req, res) {
    try {
        await ensureDatabaseConnection();
    }
    catch (error) {
        console.error("Prisma connection failed:", error);
    }
    return app(req, res);
}
if (!process.env.VERCEL) {
    const PORT = Number(process.env.PORT || 5000);
    ensureDatabaseConnection()
        .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
        .catch((error) => {
        console.error("Error starting server:", error);
        process.exit(1);
    });
}
export default handler;
//# sourceMappingURL=server.js.map