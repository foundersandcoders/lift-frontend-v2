import { EmailTest } from '../../../components/emails/TestEmail';
import { Resend } from 'resend';

const RESEND_KEY = import.meta.env.VITE_RESEND_KEY;
const resend = new Resend(RESEND_KEY);

const facTeam= {
  to: [
    "alex@foundersandcoders.com",
    "dan@foundersandcoders.com",
    "jason@foundersandcoders.com"
  ],
  names: "Alex, Dan & Jason"
}

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: ' <nudger@beacons.ink>',
      to: facTeam.to,
      subject: "Our Very First Nudgemail",
      react: EmailTest({ firstName: facTeam.names }),
    });

    if (error) {
      return Response.json( { error }, { status: 500 } )
    } else {
      return Response.json(data)
    };
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}