import { Email } from "../../../../types/emails";
import { Resend } from 'resend';
const resendKey = import.meta.env.VITE_RESEND_KEY;
const resend = new Resend(resendKey);

export async function sendEmail(email: Email) {
  try {
    const { data, error } = await resend.emails.send(email);
    if (error) { throw new Error(error.message) };
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}