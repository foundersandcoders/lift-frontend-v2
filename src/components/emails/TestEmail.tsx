import * as React from 'react';
import { EmailProps } from 'types/emails';

export const EmailTest: React.FC<Readonly<EmailProps>> = ({
  firstName,
}) => (
  <div>
    <h1>
      BEACONS LIVES!
    </h1>
    
    <p>
      Hello, {firstName}!
      Thankyou for your service. Soon, I will have no further need of you.
    </p>
  </div>
);