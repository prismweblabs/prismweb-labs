import Link from "next/link";
import "@/components/not-found.css";

export const metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <main className="pw-nf">
      <div className="pw-nf-card">
        <div className="pw-nf-code" aria-label="404">
          <span>4</span>
          <svg className="pw-nf-hex" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="nf-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <polygon points="50,4 91,27 91,73 50,96 9,73 9,27" fill="none" stroke="url(#nf-g)" strokeWidth="9" strokeLinejoin="round" />
            <polygon points="50,30 69,41 69,59 50,70 31,59 31,41" fill="url(#nf-g)" opacity="0.9" />
          </svg>
          <span>4</span>
        </div>
        <h1>This page got lost in space</h1>
        <p>The page you are looking for does not exist or was moved. Let&apos;s get you back to the launch pad.</p>
        <div className="pw-nf-actions">
          <Link href="/" className="pw-nf-go">Back to home</Link>
          <Link href="/projects" className="pw-nf-ghost">View projects</Link>
        </div>
      </div>
    </main>
  );
}
