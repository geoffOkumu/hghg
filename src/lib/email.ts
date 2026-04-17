import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "newsletter@hghg.church";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function sendConfirmationEmail(
  email: string,
  firstName: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Holy Ghost House of God <${FROM_EMAIL}>`,
      to: email,
      subject: "Welcome to Holy Ghost House of God Newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #7c3aed; text-align: center;">Welcome, ${firstName}!</h1>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Thank you for subscribing to the Holy Ghost House of God newsletter. 
            You'll receive updates about our latest articles, events, and spiritual content.
          </p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            We're blessed to have you as part of our community!
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #9ca3af;">Unsubscribe</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send confirmation email:", error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return { success: false, error };
  }
}

export async function sendNewsletterEmail(
  email: string,
  firstName: string,
  articleTitle: string,
  articleExcerpt: string,
  articleId: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Holy Ghost House of God <${FROM_EMAIL}>`,
      to: email,
      subject: `New Article: ${articleTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #7c3aed; text-align: center;">Holy Ghost House of God</h1>
          <h2 style="color: #1f2937; margin-top: 20px;">${articleTitle}</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Dear ${firstName},
          </p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            ${articleExcerpt || "A new article has been published. Click below to read it."}
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${SITE_URL}/articles/${articleId}" 
               style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px;">
              Read Full Article
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            Holy Ghost House of God Newsletter<br>
            <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #9ca3af;">Unsubscribe</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error(`Failed to send newsletter to ${email}:`, error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error(`Failed to send newsletter to ${email}:`, error);
    return { success: false, error };
  }
}
