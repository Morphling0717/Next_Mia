import path from "node:path";
import { createWindChimeSqlite } from "@windchime/embed/sqlite";

const configured = (process.env.DATABASE_PATH || "codes.db").trim();
export const windChimeDatabasePath = path.isAbsolute(configured)
  ? configured
  : path.resolve(/* turbopackIgnore: true */ process.cwd(), configured);
const state = globalThis as typeof globalThis & {
  __miaWindChimeStorage?: ReturnType<typeof createWindChimeSqlite>;
};
export const windChimeStorage = state.__miaWindChimeStorage ??=
  createWindChimeSqlite({ filename: windChimeDatabasePath });
export const windChimeSchemaReady = windChimeStorage.ready;
