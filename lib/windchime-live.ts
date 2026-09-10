import path from "node:path";
import { createWindChimeLiveRouteHandlers } from "@windchime/embed/next";
import { windChime } from "./windchime";
import { isMailAdminHeader, verifyMailAdmin } from "./mail-auth";

export const windChimeLive = createWindChimeLiveRouteHandlers({
  service: windChime,
  publicOrigin: process.env.WINDCHIME_SITE_ORIGIN,
  authorizeAdmin: verifyMailAdmin,
  hasAdminAccess: isMailAdminHeader,
  mediaDirectory: path.resolve(process.env.WINDCHIME_MEDIA_DIRECTORY || "data/mail-media"),
  allowedOrigins: (process.env.WINDCHIME_LIVE_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean),
  gatewayIssuer: process.env.WINDCHIME_GATEWAY_ORIGIN,
  gatewayPublicKeys: process.env.WINDCHIME_GATEWAY_PUBLIC_KEY
    ? { [process.env.WINDCHIME_GATEWAY_KEY_ID || "default"]: process.env.WINDCHIME_GATEWAY_PUBLIC_KEY.replace(/\\n/g, "\n") }
    : {},
});
