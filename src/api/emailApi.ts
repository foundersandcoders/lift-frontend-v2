import { Resend } from "resend";
import { Email } from "../../types/emails";
const RESEND_KEY = import.meta.env.VITE_RESEND_KEY;

const resend = new Resend(RESEND_KEY);

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