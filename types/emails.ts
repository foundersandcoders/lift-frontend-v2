export interface Email {
  from: string, /* app email address */
  to: string[], /* array containing employer email */
  subject: string, /* derp */
  html: string /* email body */ 
}

export interface EmailProps {
  firstName: string;
}