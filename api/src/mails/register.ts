export const registerMail = (url: string) => `
<h1>Hi!</h1>
<p>
  You just created an account, please click the link below to verify your email
</p>

<a href="${url}" target="_blank">
  Verify email
</a>

<p>
  <b>
    If you didn't create an account, you can safely ignore this email.
  </b>
</p>
`;
