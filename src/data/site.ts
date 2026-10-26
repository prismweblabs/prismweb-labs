// Edit this file to change text across the site.
export const site = {
  name: "PrismWeb Labs",
  tagline: "We design, build and launch websites for your business.",
  email: "prismweblabs@gmail.com",
  // Your live address. Change it when you connect a custom domain.
  url: "https://prismweb-labs.pages.dev",
  // Paste your Google Analytics ID here (looks like "G-XXXXXXXXXX"). Leave "" to turn analytics off.
  gaId: "",
  // Paste the Google Search Console HTML-tag verification code here (only the content value). Leave "" if not needed.
  searchConsole: "",
};

export type Developer = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  email: string;
  phone: string; // include country code, e.g. +919876543210
  instagram: string; // full profile URL
  linkedin: string; // full profile URL
  github: string; // full profile URL
  skills: { group: string; items: string[] }[];
};

// TODO: edit each developer's skills so they match what they really know.
const defaultSkills = [
  { group: "Frontend", items: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Tailwind CSS"] },
  { group: "Backend", items: ["Node.js", "REST APIs", "Databases"] },
  { group: "Tools", items: ["Git & GitHub", "Cloudflare", "Responsive design"] },
];

export const developers: Developer[] = [
  {
    id: "dev-kr-lahkar",
    name: "Dev Kr Lahkar",
    role: "Founder · B.Tech Engineer · Full-Stack Developer",
    bio: "Builds fast, clean websites and web apps from the first screen to the final launch.",
    photo: "/team/member-1.jpg",
    email: "deshantlahkar@gmail.com",
    phone: "+919401952404",
    instagram: "https://www.instagram.com/devkrlahkar1/",
    linkedin: "https://www.linkedin.com/in/dev-kr-lahkar-258936357",
    github: "https://github.com/Hakai99",
    skills: defaultSkills,
  },
  {
    id: "arnab-pratim-kashyap",
    name: "Arnab Pratim Kashyap",
    role: "Co-Founder · B.Tech Engineer · Full-Stack Developer",
    bio: "Turns ideas into reliable products, with a focus on clean code and smooth user experience.",
    photo: "/team/member-2.jpg",
    email: "arnabpratimk@gmail.com",
    phone: "+919395331865",
    instagram: "https://www.instagram.com/4rnab_pratix_",
    linkedin: "https://www.linkedin.com/in/arnab-pratim-kashyap-3707b240b",
    github: "https://github.com/arnabpratimk-cell",
    skills: defaultSkills,
  },
  {
    id: "mrinmoy-rajbongshi",
    name: "Mrinmoy Rajbongshi",
    role: "Co-Founder · B.Tech Engineer · Full-Stack Developer",
    bio: "Connects the frontend to solid backends so every site works well and keeps working after launch.",
    photo: "/team/member-3.jpg",
    email: "mrinmoyrbo@gmail.com",
    phone: "+919395023759",
    instagram: "https://www.instagram.com/moltate_dev",
    linkedin: "https://www.linkedin.com/in/mrinmoy-rajbongshi-309690288/",
    github: "https://github.com/MoltateCodes",
    skills: defaultSkills,
  },
];

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "#about" },
  { label: "Developers", href: "#developers" },
  { label: "Contact", href: "#contact" },
];
