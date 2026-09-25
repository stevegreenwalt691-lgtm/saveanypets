/** Canonical site origin, no trailing slash. The one place metadata, sitemap, robots and JSON-LD read it from. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
