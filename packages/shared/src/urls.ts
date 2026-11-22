declare global {
  interface ImportMetaEnv {
    readonly VITE_APP_URL: string;
    readonly VITE_SITE_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

/** The public site's origin, from the repo-root `.env.<mode>` files. */
export const siteUrl = import.meta.env.VITE_SITE_URL;

/** The members app's origin, from the repo-root `.env.<mode>` files. */
export const appUrl = import.meta.env.VITE_APP_URL;
