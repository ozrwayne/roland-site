/// <reference types="astro/client" />

type ContactEmailBinding = {
  send(message: {
    to: string;
    from: string | { email: string; name?: string };
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string | { email: string; name?: string };
  }): Promise<{ messageId: string }>;
};

type CloudflareEnv = {
  CONTACT_EMAIL: ContactEmailBinding;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL?: string;
  TURNSTILE_SITE_KEY: string;
  TURNSTILE_SECRET_KEY: string;
};

type Runtime = import('@astrojs/cloudflare').Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends Runtime {}
}
