import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export const config = {
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_secret_key: process.env.JWT_SECRET_KEY!,
  jwt_expires_in: process.env.JWT_EXPIRES!,
  jwt_refresh_secret_key: process.env.JWT_REFRESH_SECRET_KEY!,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES!,
};
