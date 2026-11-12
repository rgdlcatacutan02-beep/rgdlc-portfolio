/**
 * Forwards contact-form messages to the owner's Gmail via Web3Forms
 * (https://web3forms.com). The access key only allows sending form
 * submissions to the email it was registered with, and Web3Forms documents
 * it as safe to ship in client-side code.
 *
 * Configure with VITE_WEB3FORMS_KEY (Vercel → Project → Settings →
 * Environment Variables). Without it, email forwarding is skipped and
 * messages are only stored in Firestore.
 */

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export interface ContactEmail {
  name: string;
  email: string;
  message: string;
}

export function isEmailForwardingConfigured(): boolean {
  return Boolean(import.meta.env.VITE_WEB3FORMS_KEY);
}

export async function sendContactEmail({ name, email, message }: ContactEmail): Promise<void> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
  if (!accessKey) throw new Error('Email forwarding is not configured (VITE_WEB3FORMS_KEY missing).');

  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `New portfolio message from ${name}`,
      from_name: 'rgdlc-portfolio.vercel.app',
      name,
      email, // Web3Forms uses this as the Reply-To, so "Reply" in Gmail answers the sender
      message,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Email forwarding failed (HTTP ${res.status}).`);
  }
}
