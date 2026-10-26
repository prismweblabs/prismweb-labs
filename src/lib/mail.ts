// Opens Gmail compose in the browser. Going through Google's account chooser means:
// - signed-in visitors pick/keep their normal Gmail account and land in the compose window
// - signed-out visitors get the normal Gmail sign-in (not the Google Workspace marketing page)
export const gmailLink = (email: string) => {
  const compose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
  return `https://accounts.google.com/AccountChooser?service=mail&continue=${encodeURIComponent(compose)}`;
};
