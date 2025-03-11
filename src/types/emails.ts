export interface Email {
  // app email address
  from: string,

  // array containing employer email
  to: string[],

  // derp
  subject: string,

  // email body
  html: string
}