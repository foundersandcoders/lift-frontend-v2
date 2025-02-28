import { EmailTemplate } from '../../components/emails/EmailTemplate';
import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend("re_SDc7pz1Y_KgTU6WSyX1Ed5rtwNHsuFqnG");

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: ' <nudger@beacons.ink>',
      to: [
        "alex@foundersandcoders.com",
        "dan@foundersandcoders.com",
        "jason@foundersandcoders.com"
      ],
      subject: "Our Very First Nudgemail",
      react: EmailTemplate({ firstName: 'Alex, Dan & Jason' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}