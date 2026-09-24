import { createWindChimeService } from "@windchime/embed/server";
import { createWindChimeRouteHandlers } from "@windchime/embed/next";
import { windChimeStorage } from "./windchime-storage";
import { dbReady } from "./db";
import { isMailAdminHeader, verifyMailAdmin } from "./mail-auth";

export const windChime = createWindChimeService({
  storage: windChimeStorage,
  // Preserve explicitly empty historical salt values as well as the fallback.
  hashSalt: process.env.WINDCHIME_HASH_SALT ?? "mia-mail-default-salt",
  blockedTerms: process.env.MAIL_BLOCKED_TERMS,
  turnstileSecret: process.env.TURNSTILE_SECRET,
  ready: () => dbReady,
});
export const windChimeRoutes = createWindChimeRouteHandlers({
  service: windChime,
  authorizeAdmin: verifyMailAdmin,
  hasAdminAccess: isMailAdminHeader,
});
