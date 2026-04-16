import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const PDF_URL = 'https://aastorage.web.app/expat-guide.pdf';
const OWNER_EMAIL = 'dionisio.carvajal@gmail.com';

export const POST: APIRoute = async ({ request }) => {
  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  let body: { first_name?: string; last_name_1?: string; last_name_2?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  const { first_name, last_name_1, last_name_2, email } = body;

  if (!first_name || !email || !email.includes('@')) {
    return json({ error: 'Missing required fields' }, 400);
  }

  const fullName = [first_name, last_name_1, last_name_2].filter(Boolean).join(' ');

  try {
    // Email to the lead — delivers the guide
    await resend.emails.send({
      from: 'AA Self Storage <onboarding@resend.dev>',
      to: email,
      subject: 'Your Free Expat Guide — AA Self Storage',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#1B4D3E;padding:24px;text-align:center;">
            <h1 style="color:#C9A84C;margin:0;font-size:22px;">AA Self Storage MiniBodegas</h1>
            <p style="color:#F9F7F4;margin:6px 0 0;font-size:13px;">La Uruca, San José · junto a Migración y Extranjería</p>
          </div>
          <div style="padding:32px 24px;background:#F9F7F4;">
            <p style="font-size:16px;color:#222;">Hi ${first_name},</p>
            <p style="font-size:16px;color:#222;">Your free guide is ready. Click the button below to download it:</p>
            <div style="text-align:center;margin:28px 0;">
              <a href="${PDF_URL}"
                style="background:#C9A84C;color:#fff;padding:14px 32px;border-radius:6px;
                       text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
                ⬇ Download Your Expat Guide
              </a>
            </div>
            <p style="font-size:14px;color:#555;">
              Questions? WhatsApp us at <strong>+506 8422-7985</strong> — we respond fast.<br>
              We're open Monday–Friday, 8 am–5 pm.
            </p>
          </div>
          <div style="background:#1B4D3E;padding:16px 24px;text-align:center;">
            <p style="color:#C9A84C;margin:0;font-size:12px;">
              📞 4000-0854 · 💬 8422-7985 · aastorage.web.app
            </p>
          </div>
        </div>
      `
    });

    // Notification to owner
    await resend.emails.send({
      from: 'AA Storage Lead Form <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      subject: `New lead: ${fullName}`,
      html: `
        <p><strong>New lead from the website (Free Guide form):</strong></p>
        <ul>
          <li><strong>Name:</strong> ${fullName}</li>
          <li><strong>Email:</strong> ${email}</li>
        </ul>
        <p>Guide was sent to their inbox automatically.</p>
      `
    });

    return json({ success: true }, 200);
  } catch (err) {
    console.error('Resend error:', err);
    return json({ error: 'Email delivery failed' }, 500);
  }
};

function json(data: object, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
