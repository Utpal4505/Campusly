/**
 * Campusly Email Delivery Helper
 * Integrates directly with Resend HTTP API.
 * Falls back to console simulation when RESEND_API_KEY is not configured.
 */

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendMail({ to, subject, html, text }: SendMailOptions) {
  const apiKey = process.env['RESEND_API_KEY'];
  const fromEmail = process.env['EMAIL_FROM'] || 'Campusly <onboarding@resend.dev>';

  if (!apiKey) {
    console.log(`\n┌────────────────────────────────────────────────────────┐`);
    console.log(`│ 📧 [CAMPUSLY DEV EMAIL SIMULATOR]                      │`);
    console.log(`│ To:      ${to.padEnd(45)} │`);
    console.log(`│ Subject: ${subject.padEnd(45)} │`);
    if (text) {
      console.log(`│ OTP:     ${text.padEnd(45)} │`);
    }
    console.log(`└────────────────────────────────────────────────────────┘\n`);
    return { id: `dev-${Date.now()}`, simulated: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Resend delivery failed:', errText);
      return { error: errText };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    return { error };
  }
}

export function formatOtpEmailHtml(otp: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="margin-bottom: 24px;">
        <span style="font-size: 24px; font-weight: 800; color: #7c3aed; letter-spacing: -0.5px;">Campusly</span>
        <span style="font-size: 12px; background: #f3e8ff; color: #6b21a8; padding: 2px 8px; border-radius: 9999px; margin-left: 8px; font-weight: 600;">Campus Auth</span>
      </div>
      <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Verify your campus account</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
        Welcome to Campusly. Use the 6-digit verification code below to verify your student account and complete registration.
      </p>
      <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 24px;">
        <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f172a;">${otp}</span>
      </div>
      <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin: 0;">
        ⏱️ This code expires in 10 minutes. If you did not request this verification, you can safely disregard this email.
      </p>
    </div>
  `;
}
