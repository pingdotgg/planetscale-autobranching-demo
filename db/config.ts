import type { Config } from "drizzle-kit";

import { env } from "../env";

export const credentials = (() => {
  const c = {
    database: env.DATABASE_NAME,
    host: env.DATABASE_HOST,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
  };

  const pushUrl = new URL(c.database, `mysql://${c.host}:3306`);
  pushUrl.username = c.username;
  pushUrl.password = c.password;
  pushUrl.searchParams.set("ssl", '{"rejectUnauthorized":true}');
  return Object.assign(c, { pushUrl: pushUrl.href });
})();

export default {
  dbCredentials: { uri: credentials.pushUrl },
  driver: "mysql2",
  schema: "./db/schema.ts",
} satisfies Config;
