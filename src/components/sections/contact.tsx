import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { gmailLink } from "@/lib/mail";

const field =
  "w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";

export function Contact() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 rounded-3xl border border-border bg-card p-5 sm:p-8 md:p-12 lg:grid-cols-2">
        <div className="min-w-0 space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Have a project? <span className="text-gradient">Let&apos;s talk.</span>
          </h2>
          <p className="text-muted-foreground">
            Tell us your name, your email and about your website. We will reply with a plan and a quote.
          </p>
          <a href={gmailLink(site.email)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 break-all text-sm text-muted-foreground hover:text-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            {site.email}
          </a>
        </div>

        {/* Plain HTML form: posts to the Cloudflare Pages Function at /api/contact. */}
        <form
          name="contact"
          method="POST"
          action="/api/contact"
          className="min-w-0 space-y-4"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>
              Don&apos;t fill this out: <input name="bot-field" />
            </label>
          </p>
          <input name="name" required placeholder="Your name" autoComplete="name" className={field} />
          <input name="email" type="email" required placeholder="Your email" autoComplete="email" className={field} />
          <input name="website" placeholder="Your website (link, if you have one)" className={field} />
          <textarea name="message" required rows={5} placeholder="Tell us about your website: what you need, your idea, timeline" className={field} />
          <Button type="submit" size="lg" variant="light" className="h-12 w-full rounded-full">
            Send message
          </Button>
        </form>
      </div>
    </section>
  );
}
