// Opens Gmail's compose window in the browser (works even when no email app is installed).
export const gmailLink = (email: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
