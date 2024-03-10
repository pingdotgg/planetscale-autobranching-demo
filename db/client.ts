import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless"

import { credentials } from "./config";
import * as schema from "./schema";

const client = new Client(credentials);
(async () => {
  await client.execute("SET @@boost_cached_queries = true");
})();

export const db = drizzle(client, { schema });