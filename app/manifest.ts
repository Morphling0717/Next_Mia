import type { MetadataRoute } from "next";
import { loadEditableSiteConfig } from "@/lib/site-data";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const config = await loadEditableSiteConfig();

  return {
    id: "/",
    name: config.pwa.manifestName,
    short_name: config.pwa.manifestShortName,
    description: config.pwa.manifestDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fbf6ec",
    theme_color: "#fbf6ec",
    categories: ["entertainment", "music", "lifestyle"],
    icons: [
      {
        src: "/app.jpg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/app.jpg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "maskable",
      },
      {
        src: "/app.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/app.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };
}
