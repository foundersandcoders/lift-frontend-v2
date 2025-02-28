import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <h1>BEACONS LIVES!</h1>
    <p>
      Hello, {firstName}!
      Thankyou for your service. Soon, I will have no further need of you.
    </p>
  </div>
);