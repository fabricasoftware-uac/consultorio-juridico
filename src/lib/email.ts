export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailProvider {
  send(params: SendEmailParams): Promise<SendEmailResult>;
}

class ResendProvider implements EmailProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY ?? "";
  }

  async send({ to, subject, html }: SendEmailParams): Promise<SendEmailResult> {
    if (!this.apiKey) {
      return { success: false, error: "RESEND_API_KEY no configurada" };
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: process.env.NOTIFICATIONS_FROM_EMAIL ?? "noreply@consultoriojuridico.app",
          to,
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        return { success: false, error: `Resend error ${res.status}: ${body}` };
      }

      const data = await res.json();
      return { success: true, messageId: data.id };
    } catch (err: any) {
      return { success: false, error: err.message ?? "Error desconocido" };
    }
  }
}

class SmtpProvider implements EmailProvider {
  async send({ to, subject, html }: SendEmailParams): Promise<SendEmailResult> {
    // Implementacion futura para SMTP institucional
    return {
      success: false,
      error: "SMTP provider no implementado. Use EMAIL_PROVIDER=RESEND",
    };
  }
}

export function getEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER ?? "RESEND";
  if (provider === "SMTP") return new SmtpProvider();
  return new ResendProvider();
}
